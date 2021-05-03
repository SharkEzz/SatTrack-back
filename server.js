import express from 'express';
import database from './database/database.js';
import databaseConfig from './config/db.json';
import serverConfig from './config/server.json';
import { satelliteFixtures, currentTrackingFixtures, locationFixtures } from './database/fixtures/index.js';
import satellites from './api/satellites.js';
import bodyParser from 'body-parser';
import currentTracking from './api/currentTracking.js';
import location from './api/location.js';

const app = express();

app.use(bodyParser.json());

satellites(app, database);
currentTracking(app, database);
location(app, database);

database.sync({ force: databaseConfig.force, logging: databaseConfig.logging }).then(async () => {
    if(databaseConfig.loadFixtures)
    {
        await database.models.Satellite.bulkCreate(satelliteFixtures);
        await database.models.Location.bulkCreate(locationFixtures);
        await database.models.CurrentTracking.bulkCreate(currentTrackingFixtures);
    }
    app.listen(serverConfig.port, () => {
        console.log(`Server started on port ${serverConfig.port}`);
    })
});
