import express from 'express';
import log from './utils/log.js';
import db from './models/index.js';
import apiSatellites from './api/satellite.js';
import apiCurrentTracking from './api/currentTracking.js';
import apiUserLocation from './api/userLocation.js';
import config from './config/config.json';
import satelliteFixtures from './fixtures/satellites.js';
import userLocationFixtures from './fixtures/userLocation.js';
import currentTrackingFixtures from './fixtures/currentTracking.js';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

apiSatellites(app, db);
apiCurrentTracking(app, db);
apiUserLocation(app, db);

db.sequelize.sync({force: config.resetDB, logging: log.info}).then(async () => {
    if (config.resetDB) {
        await db.satellite.bulkCreate(satelliteFixtures);
        await db.userlocation.bulkCreate(userLocationFixtures);
        await db.currenttracking.bulkCreate(currentTrackingFixtures)
    }
    app.listen(config.port, () => 
        log.info(`Server started on port ${config.port}`)
    );
})
