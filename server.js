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
import http from 'http';
import WebSocket from 'ws';
import url from 'url';
import { getCurrentTracking, getVisiblesAndTracking, initCron } from './utils/wsUtils.js';

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

const server = http.createServer(app);

const wssClient = new WebSocket.Server({ noServer: true });
const wssUtility = new WebSocket.Server({ noServer: true });


let currentLocation = null;
let currentTracking = null; 

apiSatellites(app, db);
apiCurrentTracking(app, db, (currTracking) => {currentTracking = currTracking});
apiUserLocation(app, db, (currLocation) => {currentLocation = currLocation});

db.sequelize.sync({force: config.resetDB, logging: log.info}).then(async () => {
    if (config.resetDB) {
        await db.satellite.bulkCreate(satelliteFixtures);
        await db.userlocation.bulkCreate(userLocationFixtures);
        await db.currenttracking.bulkCreate(currentTrackingFixtures)
    }

    await db.userlocation.findByPk(1).then((location) => {
        currentLocation = location;
    });
    await db.currenttracking.findByPk(1, {
        include: {
            model: db.satellite,
            as: 'satellite',
            required: false,
            attribute: ['id', 'tle']
        }
    }).then((tracking) => {
        currentTracking = tracking.satellite;
    });

    wssClient.on('connection', (ws) => {
        initCron(ws, () => {
            getVisiblesAndTracking(db, currentTracking, currentLocation)
                .then((response) => ws.send(response));
        }, 1);
    });

    wssUtility.on('connection', (ws) => {
        initCron(ws, () => {
            ws.send(getCurrentTracking(currentTracking, currentLocation));
        }, 1);
    });

    server.on('upgrade', (req, socket, head) => {
        const path = url.parse(req.url).pathname;

        if (path === '/client') {
            wssClient.handleUpgrade(req, socket, head, (ws) => wssClient.emit('connection', ws, req));
        } else if(path === '/utility') {
            wssUtility.handleUpgrade(req, socket, head, (ws) => wssUtility.emit('connection', ws, req));
        } else {
            socket.destroy();
        }
    })

    server.listen(config.port, () => 
        log.info(`Server started on port ${config.port}`)
    );
})
