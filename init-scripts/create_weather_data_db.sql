CREATE DATABASE IF NOT EXISTS weather_data_db;
USE weather_data_db;

-- Drop and create `batches` table
DROP TABLE IF EXISTS `batches`;
CREATE TABLE `batches` (
  `batch_id` varchar(256) NOT NULL,
  `forecast_time` datetime NOT NULL,
  `number_of_rows` int DEFAULT NULL,
  `start_ingest_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_ingest_time` datetime DEFAULT NULL,
  `status` enum('RUNNING','ACTIVE','INACTIVE','DELETED') NOT NULL,
  PRIMARY KEY (`batch_id`)
);

-- Drop and create `weather_data` table
DROP TABLE IF EXISTS `weather_data`;
CREATE TABLE `weather_data` (
  `batch_id` varchar(255) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `forecast_time` datetime NOT NULL,
  `temperature` decimal(5,2) NOT NULL,
  `precipitation_rate` decimal(5,2) NOT NULL,
  `humidity` decimal(5,2) NOT NULL,
  PRIMARY KEY `batch_id` (`batch_id`),
  KEY `latitude` (`latitude`),
  KEY `longitude` (`longitude`),
  KEY `forecast_time` (`forecast_time`),
  CONSTRAINT `weather_data_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE CASCADE
);
