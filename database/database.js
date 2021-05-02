import DataTypes, { Sequelize } from 'sequelize';
import databaseConfig from '../config/db.json';
import SatelliteModel from './models/Satellite.js';
import CurrentTrackingModel from './models/CurrentTracking.js';
import LocationModel from './models/Location.js';

const database = new Sequelize({
    dialect: databaseConfig.dialect,
    storage: databaseConfig.path
})

try
{
    await database.authenticate();
    console.info('Sequelize connected to database');
}
catch(e)
{
    console.error('Error: Sequelize database connection error');
    throw e;
}

// Models loading
SatelliteModel(database, DataTypes);
LocationModel(database, DataTypes);
CurrentTrackingModel(database, DataTypes);

export default database;
