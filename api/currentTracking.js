import { getInfos } from '../utils/satelliteUtils.js';

const currentTracking = (app, db, setCurrentTracking) => {

    app.get('/api/current_tracking', (req, res) => {
        db.userlocation.findByPk(1).then((location) => {
            db.currenttracking.findByPk(1, {
                include: {
                    model: db.satellite,
                    as: 'satellite',
                    required: false,
                    attribute: ['id', 'tle']
                }
            }).then((tracking) => {
                const sat = tracking.satellite;
                let currentTracking = sat ? {satellite: {id: sat.id, ...getInfos(sat.tle, location)}} : {satellite: null};
                setCurrentTracking(sat)
                res.json(currentTracking ?? null);
            })
        });
    });

    app.patch('/api/current_tracking', (req, res) => {
        db.userlocation.findByPk(1).then((location) => {
            db.currenttracking.findByPk(1).then((tracking) => {
                db.satellite.findByPk(req.body.satelliteId).then((satellite) => {
                    if(!satellite && req.body.satelliteId !== null) res.status(404).json({
                        responseCode: 404,
                        message: 'Satellite not found'
                    });
                    else if(req.body.satelliteId === null)
                    {
                        tracking.setSatellite(null).then(() => {
                            res.json({satellite: null})
                        })
                    }
                    else {
                        tracking.setSatellite(satellite).then(() => {
                            res.json({satellite: {id: satellite.id, ...getInfos(satellite.tle, location)}})
                        })
                    }
                })
            })
        });
    })
};

export default currentTracking;
