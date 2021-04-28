import { collectionNormalize, itemNormalize } from '../utils/satelliteNormalizer.js';
import { getInfos, isVisible, getVisibles } from '../utils/satelliteUtils.js';

const satellite = (app, db) => {

    app.get('/api/satellites', (req, res) => {
        db.satellite.findAll()
            .then(satellites => res.json(collectionNormalize(satellites)));
    });

    app.get('/api/satellites_visibles', (req, res) => {
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
};

export default satellite;
