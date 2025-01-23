-- constraints will always be in the end of the table definition


CREATE OR REPLACE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    userName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL, -- this will be tha hash of the password
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT passwordHash CHECK (LENGTH(passwordHash) = 60)
);

CREATE OR REPLACE TABLE BeeVice (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    ownerId INT NOT NULL, -- Maybe this is a little redundant
    serialNumber VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ownerIdBeeVice FOREIGN KEY (ownerId) REFERENCES Users(id)
);

CREATE OR REPLACE TABLE Hives (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    ownerId INT NOT NULL,
    customId VARCHAR(100),
    beeViceId INT,
    queenColor ENUM('white', 'yellow', 'red', 'green', 'blue'),
    breed VARCHAR(100),
    location VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ownerIdHives FOREIGN KEY (ownerId) REFERENCES Users(id),
    CONSTRAINT beeViceIdHives FOREIGN KEY (beeViceId) REFERENCES BeeVice(id)
);

CREATE OR REPLACE TABLE Sensors (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    type VARCHAR(30), -- Temp, Humidity, Weight, Frequency, etc
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TABLE SensorReads(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    sensorType INT NOT NULL,
    beeViceId INT NOT NULL,
    value FLOAT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT sensorTypeSensorReads FOREIGN KEY (sensorType) REFERENCES Sensors(id),
    CONSTRAINT beeViceIdSensorReads FOREIGN KEY (beeViceId) REFERENCES BeeVice(id)
);

CREATE OR REPLACE TABLE BeeViceLogs (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    beeViceId INT NOT NULL,
    batteryLevel FLOAT,
    additionalMessage TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT beeViceIdBeeViceLogs FOREIGN KEY (beeViceId) REFERENCES BeeVice(id)
);

CREATE OR REPLACE TABLE queuedCommands (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    beeViceId INT NOT NULL,
    commandId INT NOT NULL,
    params JSON,
    executed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT beeViceIdQueuedCommands FOREIGN KEY (beeViceId) REFERENCES BeeVice(id),
    CONSTRAINT commandIdQueuedCommands FOREIGN KEY (commandId) REFERENCES Commands(id)
);

CREATE OR REPLACE TABLE Commands (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    command VARCHAR(50) NOT NULL,
    possibleParams JSON
);

CREATE OR REPLACE TABLE InspectionTypes (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE OR REPLACE TABLE Inspections (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    hiveId INT NOT NULL,
    inspectionTypeId INT NOT NULL,
    params JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT hiveIdInspections FOREIGN KEY (hiveId) REFERENCES Hives(id),
    CONSTRAINT inspectionTypeIdInspections FOREIGN KEY (inspectionTypeId) REFERENCES InspectionTypes(id)
);

CREATE OR REPLACE VIEW sensorReadsView AS
SELECT Hives.ownerId, Hives.id AS hiveId, Hives.queenColor, Hives.breed, Hives.location, 
SensorReads.sensorType AS sensorTypeId, SensorReads.value, SensorReads.createdAt, Sensors.type AS sensorType FROM Hives
JOIN SensorReads ON Hives.beeViceId = SensorReads.beeViceId
JOIN Sensors ON SensorReads.sensorType = Sensors.id;

CREATE OR REPLACE VIEW beeViceLogsView AS
SELECT Hives.customId, logs.beeViceId, logs.batteryLevel, logs.additionalMessage, logs.createdAt FROM BeeViceLogs AS logs
JOIN Hives ON logs.beeViceId = Hives.beeViceId;

CREATE OR REPLACE VIEW inspectionView AS
SELECT Hives.customId, Inspections.createdAt, InspectionTypes.type, Inspections.params FROM Inspections
JOIN Hives ON Inspections.hiveId = Hives.id
JOIN InspectionTypes ON Inspections.inspectionTypeId = InspectionTypes.id;

INSERT INTO Commands (command, possibleParams) VALUES 
('WIFI_CHANGE', '{"ssid": "string", "password": "string"}'),
('WAKEUP_CHANGE', '{"wakeUpTimes": "int[] - in seconds"}');
-- INSERTS
INSERT INTO Sensors (type) VALUES 
('Temp'),
('Humidity'),
('Weight'),
('Frequency');

DELIMITER $$
CREATE OR REPLACE TRIGGER executedCommand AFTER UPDATE ON queuedCommands
FOR EACH ROW
BEGIN
    IF NEW.executed = TRUE THEN

        INSERT INTO BeeViceLogs (beeViceId, additionalMessage) VALUES (NEW.beeViceId, 'Command ' + NEW.commandId + ' executed with params ' + NEW.params);
        IF getCommandNameById(NEW.commandId) = 'WAKEUP_CHANGE' THEN
            UPDATE BeeVice SET wakeUpTimes = NEW.params WHERE id = NEW.beeViceId;
        END IF;
    END IF;
END$$
DELIMITER ;

CREATE OR REPLACE FUNCTION getCommandNameById(commandId INT) RETURNS VARCHAR(50)
RETURN (SELECT command FROM Commands WHERE id = commandId);