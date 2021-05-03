import url from 'whatwg-url';
import WebSocket from 'ws';
import { itemNormalizer as locationItemNormalizer } from '../database/normalizers/locationNormalizer.js';
import { getSatInfos, isSatelliteVisible } from '../libs/satelliteUtils.js';
import { getSatelliteName } from 'tle.js/dist/tlejs.esm.js';

let refreshInterval = null;

/**
 * @param {import('sequelize').Sequelize} db
 * @param {import('http').Server} server
 * @param {Number} refreshIntervalSeconds
 */
export default (server, db, refreshIntervalSeconds) => {
    const wss = new WebSocket.Server({ noServer: true });

    const computeData = async () => {
        const trackedSatellite = await db.models.CurrentTracking.findByPk(1, {
            include: {
                model: db.models.Satellite,
                required: false,
            }
        });
        const location = await db.models.Location.findByPk(1);
        const satellites = await db.models.Satellite.findAll();

        return {
            satellites: satellites.map(satellite => ({
                id: satellite.id,
                name: getSatelliteName(satellite.tle),
                isVisible: isSatelliteVisible(satellite.tle, location)
            })),
            trackedSatellite: trackedSatellite.satelliteId && getSatInfos(trackedSatellite.Satellite.tle, location),
            location: locationItemNormalizer(location)
        };
    };

    wss.on('connection', (ws) => {
        // Set the interval only for the first connection
        if(wss.clients.size === 1)
        {
            refreshInterval = new setInterval(async () => {
                const payload = await computeData();
                ws.send(JSON.stringify(payload));
            }, refreshIntervalSeconds * 1000);
        }

        ws.on('close', () => wss.emit('disconnect'));
    });

    wss.on('disconnect', () => {
        // Clear the interval when there is no more connected clients
        if(wss.clients.size === 0)
        {
            clearInterval(refreshInterval);
        }
    })

    server.on('upgrade', (req, socket, head) => {
        const path = url.parseURL(req.url, {
            baseURL: 'ws://' + req.headers.host,
        }).path[0];

        if(path === 'websocket')
            wss.handleUpgrade(req, socket, head, (ws) => { wss.emit('connection', ws, req) })
        else
            socket.destroy();
    })
};
