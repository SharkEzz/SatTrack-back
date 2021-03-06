import { isSatelliteVisible } from '../libs/satelliteUtils.js';

/**
 * @param {import("express").Express} app 
 * @param {import("sequelize").Sequelize} db 
 */
const currentTracking = (app, db) => {
    app.patch('/api/current_tracking', async (req, res) => {
        const { satelliteId } = req.body;
        if(!satelliteId)
        {
            res.status(400).send({
                error: 'Missing satellite id in request body'
            });
            return;
        }
        const satellite = await db.models.Satellite.findByPk(satelliteId);
        if(!satellite)
        {
            res.status(404).send({
                error: 'Satellite not found'
            });
            return;
        }

        const currentTracking = await db.models.CurrentTracking.findByPk(1);
        const location = await db.models.Location.findByPk(1);

        if((location.latitude && location.longitude && location.altitude) && isSatelliteVisible(satellite.tle, location))
        {
            const updatedTracking = await currentTracking.update({
                satelliteId
            });
            res.send(updatedTracking);
        }
        else
        {
            res.status(403).send({
                error: 'Satellite is not visible'
            });
        }
        

    });

    app.delete('/api/current_tracking', async (_, res) => {
        const tracking = await db.models.CurrentTracking.findByPk(1);
        if(tracking.satelliteId === null)
        {
            res.send({
                error: 'No satellite currently tracked'
            });
            return;
        }

        const updatedTracking = await tracking.update({
            satelliteId: null
        });

        res.send(updatedTracking);
    })
};

export default currentTracking;
