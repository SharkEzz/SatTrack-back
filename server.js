import express from 'express';
import log from './utils/log.js';
import db from './models/index.js';
import apiSatellites from './api/satellite.js';
import config from './config/config.json';
import satelliteFixtures from './fixtures/satellites.js';
import userLocationFixtures from './fixtures/userLocation.js';

const app = express();

app.use((req, _res, next) => {
   console.log(`URL : ${req.url}`);
   next();
});

apiSatellites(app, db);

db.sequelize.sync({force: config.resetDB, logging: log.info}).then(() => {
    if (config.resetDB) {
        db.satellite.bulkCreate(satelliteFixtures).then(() => {
            db.userlocation.bulkCreate(userLocationFixtures);
        });
    }
    app.listen(config.port, () => 
        log.info(`Server started on port ${config.port}`)
    );
})
