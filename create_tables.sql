use earnup;

CREATE TABLE `earnup`.`Properties` (
  `propertiesId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500) NULL,
  `hostId` INT NULL,
  `hostName` VARCHAR(250) NULL,
  `neighborhoodGroup` VARCHAR(100) NULL,
  `neighborhood` VARCHAR(100) NULL,
  `latitude` DECIMAL(10,8) NULL,
  `longitude` DECIMAL(11,8) NULL,
  `roomType` VARCHAR(45) NULL,
  `price` INT NULL,
  `minimumNights` INT NULL,
  `numberOfReviews` INT NULL,
  `lastReview` DATETIME NULL,
  `reviewsPerMonth` DECIMAL(10,2) NULL,
  `calculatedHostListingCount` INT NULL,
  `availability` INT NULL,
  PRIMARY KEY (`propertiesId`));
