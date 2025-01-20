-- constraints will always be in the end of the table definition


CREATE OR REPLACE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    userName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL, -- this will be tha hash of the password
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    beeViceId INT NOT NULL,
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
    batteryLevel FLOAT NOT NULL,
    additionalMessage TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT beeViceIdBeeViceLogs FOREIGN KEY (beeViceId) REFERENCES BeeVice(id)
);


-- INSERTS
INSERT INTO Sensors (type) VALUES 
('Temp'),
('Humidity'),
('Weight'),
('Frequency');

