import { collectionNormalize, itemNormalize } from '../utils/satelliteNormalizer.js';
import { getInfos, isVisible, getVisibles, checkTle } from '../utils/satelliteUtils.js';

const satellite = (app, db) => {

    app.get('/api/satellites', (req, res) => {
        db.satellite.findAll()
            .then(satellites => res.json(collectionNormalize(satellites)));
    });

    app.get('/api/visible_satellites', (req, res) => {
        db.userlocation.findByPk(1).then((location) => {
            db.satellite.findAll()
                .then(satellites => res.json(getVisibles(satellites, location)));
        });
    });

    app.get('/api/satellites/:id', (req, res) => {
        db.satellite.findByPk(req.params.id)
            .then((satellite) => {
                if(satellite)
                    res.json(itemNormalize(satellite));
                else
                    res.status(404).json({
                        responseCode: 404,
                        message: 'Satellite not found'
                    });
            })
    })

    app.get('/api/satellites/:id/infos', (req, res) => {
        db.userlocation.findByPk(1).then((location) => {
            db.satellite.findByPk(req.params.id)
            .then((satellite) => {
                if(satellite)
                    res.json(getInfos(satellite.tle, location));
                else
                    res.status(404).json({
                        responseCode: 404,
                        message: 'Satellite not found'
                    });
            })
        })
    })

    app.get('/api/satellites/:id/is_visible', (req, res) => {
        db.userlocation.findByPk(1).then((location) => {
            db.satellite.findByPk(req.params.id)
            .then((satellite) => {
                if(satellite)
                    res.json(isVisible(satellite.tle, location));
                else
                    res.status(404).json({
                        responseCode: 404,
                        message: 'Satellite not found'
                    });
            })
        })
    })

    app.post('/api/satellites', (req, res) => {
        const tle = req.body.tle;
        if(!tle || !checkTle(tle)) {
            res.status(400).json({
                responseCode: 400,
                message: 'Wrong TLE'
            });
        } else {
            db.satellite.create({
                tle
            }).then((result) => res.status(201).json(collectionNormalize([result])[0]))
            .catch(err => res.status(400).json({
                responseCode: 400,
                message: err.errors[0].message
            }));
        }
    });

    app.put('/api/satellites/:id', (req, res) => {
        const tle = req.body.tle;
        if(!tle || !checkTle(tle)) {
            res.status(400).json({
                responseCode: 400,
                message: 'Wrong TLE'
            });
        } else {
            db.satellite.update({
                tle
            },
            {
                where: {
                    id: req.params.id
                },
            }).then((result) => {
                db.satellite.findByPk(req.params.id).then(sat => res.status(201).json(collectionNormalize([sat])[0]))
            })
            .catch(err => res.status(400).json({
                responseCode: 400,
                message: err.errors[0].message
            }));
        }
    });

    app.delete('/api/satellites/:id', (req, res) => {
        db.satellite.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => res.status(204).json('ok'))
        .catch(err => res.status(400).json({
            responseCode: 400,
            message: err.errors[0].message
        }));
    });
};

export default satellite;
