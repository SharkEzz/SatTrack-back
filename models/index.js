import DataTypes, { Sequelize } from 'sequelize';

import satellite from './satellite.js';
import userlocation from './userlocation.js';
import currenttracking from './currenttracking.js';

import config from '../config/configdb.json';
import serverConfig from '../config/config.json';

const db = {};
let sequelize = new Sequelize(config.database, config.username, config.password, config);

let model;

// Satellite
model = satellite(sequelize, DataTypes);
db[model.name] = model;

// UserLocation
model = userlocation(sequelize, DataTypes);
db[model.name] = model;

// CurrentTracking
model = currenttracking(sequelize, DataTypes);
db[model.name] = model;




// Associate
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
