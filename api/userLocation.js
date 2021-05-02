const userLocation = (app, db, setCurrentLocation) => {

    app.get('/api/user_location', (req, res) => {
        db.userlocation.findByPk(1).then((location) => {
            setCurrentLocation(location);
            res.json(location);
        });
    });

    app.patch('/api/user_location', (req, res) => {
        db.userlocation.update({
            lat: req.body.lat,
            lng: req.body.lng,
            alt: req.body.alt
        },
        {
            where: {
                id: 1
            }
        }).then((result) => res.json(result))
        .catch(error => res.status(400).json({
            responseCode: 400,
            message: 'Bad request'
        }))
    })
};

export default userLocation;
