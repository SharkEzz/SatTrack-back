import WebSocket from "ws";
import cron from 'node-cron';
import { getInfos, getVisibles } from "./satelliteUtils.js";

const dispatch = (wss) => {
    return (message) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

const initCron = (ws, callback, seconds = 1) => {
    let task = cron.schedule(`*/${seconds} * * * * *`, callback);

    ws.on('close', () => task.stop())
}

const getCurrentTracking = (tracking, location) => {
    return JSON.stringify(tracking ? {satellite: {id: tracking.id, ...getInfos(tracking.tle, location)}} : {satellite: null});
}

const getVisiblesAndTracking = (db, tracking, location) => {
    return db.satellite.findAll()
        .then(satellites => {
            return JSON.stringify({
                visibles: getVisibles(satellites, location),
                tracking: tracking ? {id: tracking.id, ...getInfos(tracking.tle, location)} : null
            });
        });
}

export { dispatch, initCron, getCurrentTracking, getVisiblesAndTracking };