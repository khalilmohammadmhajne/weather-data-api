
# Tomorrow.io Data Team Candidate Home Work - Khalil Mhajne

## Project Overview

**Tomorrow.io Home Work** is a Node.js-based application for fetching and processing weather data. It uses a MySQL database for storage, Docker for containerization, and Redis for caching. The project consists of scheduled cron jobs that fetch weather data in batches, process it, and ingest it into a database. It also includes a server to serve the processed data.

## Table of Contents

- [Tomorrow.io Data Team Candidate Home Work - Khalil Mhajne](#tomorrowio-data-team-candidate-home-work---khalil-mhajne)
  - [Project Overview](#project-overview)
  - [Table of Contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Dependencies](#2-install-dependencies)
  - [Configuration](#configuration)
    - [1. Set Up Local Environment Variables](#1-set-up-local-environment-variables)
    - [2. Docker Setup](#2-docker-setup)
  - [Running the Application Locally](#running-the-application-locally)
    - [Step 1: Initialize Database](#step-1-initialize-database)
    - [Step 2: Run Batches Cron](#step-2-run-batches-cron)
    - [Step 3: Ingest Weather Data](#step-3-ingest-weather-data)
    - [Step 4: Start the Server](#step-4-start-the-server)
  - [Running the Tests](#running-the-tests)
  - [Production Hosting URL](#production-hosting-url)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues:](#common-issues)

## Technologies

- **Node.js**: JavaScript runtime for building scalable applications.
- **Docker**: Containerization for managing services such as MySQL.
- **Redis**: Caching layer for optimizing performance.
- **MySQL**: Relational database for storing weather data.

## Prerequisites

Before you begin, ensure you have the following software installed:

- **Node.js** (v20 or above) – [Install Node.js](https://nodejs.org/en/)
- **Docker** – [Install Docker](https://www.docker.com/get-started)

## Installation

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/tomorrow-code-challenge/tmw-home-test-khalil-mhajne.git
cd tmw-home-test-khalil-mhajne
```

### 2. Install Dependencies
Install the required dependencies using `npm`:
```bash
npm install
```

## Configuration

### 1. Set Up Local Environment Variables
Create a `.env` file in the root of the project and define the following environment variables:

```env
SERVER_PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=weather_data_db
DB_PORT=3306
DB_CONNECTION_LIMIT=5
REDIS_HOST=localhost
REDIS_PORT=6379
WEATHER_DATA_URL=https://us-east1-climacell-platform-production.cloudfunctions.net/weather-data/batches
MAX_RETRIES=3
RETRY_DELAY=2000
CONCURRENCY_LIMIT=5
```

### 2. Docker Setup
Make sure Docker is installed and running. You will use Docker Compose to set up the necessary services, including the database.

## Running the Application Locally

### Step 1: Initialize Database
Run the following command to start up the database and services using Docker Compose:
```bash
npm run init-db
```
This will bring down any existing containers and start fresh containers for the database and other services.

### Step 2: Run Batches Cron
Fetch weather data in batches using the cron job:
```bash
npm run batchesCron
```
This step will fetch weather data from the configured external source and prepare it for ingestion.

### Step 3: Ingest Weather Data
Once the batches are fetched, ingest the weather data into the MySQL database by running:
```bash
npm run ingest
```

### Step 4: Start the Server
Finally, start the server to run the application:
```bash
npm run start
```
This will launch the server on the specified port (default: `8080`).

## Running the Tests
To run the unit tests, simply use:
``` text 
npm run test
```

## Production Hosting URL

The service was deployed, you can use it through the following URL:

```text
http://35.225.213.117/
```

## Troubleshooting

### Common Issues:
- **Database Connection Issues**: Ensure Docker is running and the `.env` file has the correct database credentials.
- **Environment Variable Issues**: Double-check that all required environment variables are properly set in the `.env` file.
- **Service Startup Issues**: Ensure Docker containers are up and running using `docker ps`.
