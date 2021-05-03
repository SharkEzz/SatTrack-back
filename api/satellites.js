import { validateTle } from '../libs/satelliteUtils.js';

/**
 * @param {import("express").Express} app 
 * @param {import("sequelize").Sequelize} db 
 */
const satellites = (app, db) => {
    app.post('/api/satellites', async (req, res) => {
        const { tle } = req.body;
        if(!tle || !validateTle(tle))
        {
            res.status(400).send({
                error: 'Missing or invalid TLE in request body'
            });
            return;
        }

        const newSatellite = await db.models.Satellite.create({tle});

        res.status(201).send(newSatellite);
    });

    app.patch('/api/satellites/:id([0-9]+)', async (req, res) => {
        const satellite = await db.models.Satellite.findByPk(req.params.id);
        const { tle } = req.body;
        if(!satellite)
        {
            res.status(404).send({
                error: 'Satellite not found'
            })
            return;
        }
        else if(!tle || !validateTle(tle))
        {
            res.status(400).send({
                error: 'Missing or invalid TLE in request body'
            })
            return;
        }

        // TODO: check if current tracking sat is the updated sat

        const updatedSatellite = await satellite.update({
            tle
        });

        res.send(updatedSatellite);
    });

    app.delete('/api/satellites/:id([0-9]+)', async (req, res) => {
        const satellite = await db.models.Satellite.findByPk(req.params.id);
        if(!satellite)
        {
            res.status(404).send({
                error: 'Satellite not found'
            })
            return;
        }
        await satellite.destroy();

        const currentTracking = await db.models.CurrentTracking.findByPk(1);
        if(currentTracking.satelliteId)
            await currentTracking.update({
                satelliteId: null
            });

        res.send({success: 'Satellite deleted'});
    });
};

export default satellites;
