/**
 * @param {import("express").Express} app 
 * @param {import("sequelize").Sequelize} db 
 */
 const currentTracking = (app, db) => {
    app.patch('/api/location', async (req, res) => {
        const { latitude, longitude, altitude } = req.body;
        if(!latitude && !longitude && !altitude)
        {
            res.status(401).send({
                error: 'Missing required data in request body'
            });
            return;
        }
        const location = await db.models.Location.findByPk(1);

        const updatedLocation = await location.update({
            latitude,
            longitude,
            altitude
        });

        res.send(updatedLocation);
    });

    app.delete('/api/location', async (_, res) => {
        const location = await db.models.Location.findByPk(1);

        const updatedLocation = await location.update({
            latitude: null,
            longitude: null,
            altitude: null
        });

        // Remove the currently tracked satellite if there is one
        const currentTracked = await db.models.CurrentTracking.findByPk(1);
        if(currentTracked.satelliteId)
            await currentTracked.update({
                satelliteId: null
            });

        res.send(updatedLocation);
    })
};

export default currentTracking;
