import DataTypes, { Sequelize } from "sequelize";

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
export default (sequelize, dataTypes) => {
    const CurrentTracking = sequelize.define('CurrentTracking', {
        id: {
            type: dataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        timestamps: false   
    })

    CurrentTracking.belongsTo(sequelize.models.Satellite, {
        foreignKey: 'satelliteId',
        targetKey: 'id'
    });

    return CurrentTracking;
};
