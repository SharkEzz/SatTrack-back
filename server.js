import express from 'express';
import http from 'http';
import database from './database/database.js';
import databaseConfig from './config/db.json';
import serverConfig from './config/server.json';
import { satelliteFixtures, currentTrackingFixtures, locationFixtures } from './database/fixtures/index.js';
import satellites from './api/satellites.js';
import bodyParser from 'body-parser';
import currentTracking from './api/currentTracking.js';
import location from './api/location.js';
import websocket from './websocket/websocket.js';

const app = express();
const server = http.createServer(app);

// Auto body JSON parsing
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Load API endpoints
satellites(app, database);
currentTracking(app, database);
location(app, database);

// Websocket
websocket(server, database, serverConfig.webSocketRefreshInterval);

// Sync database and start server
await database.sync({ force: databaseConfig.force, logging: databaseConfig.logging }).then(async () => {
    if(databaseConfig.loadFixtures)
    {
        await database.models.Satellite.bulkCreate(satelliteFixtures);
        await database.models.Location.bulkCreate(locationFixtures);
        await database.models.CurrentTracking.bulkCreate(currentTrackingFixtures);
    }
});

server.listen(serverConfig.port, () => {
    console.log(`Server started on port ${serverConfig.port}`);
})
