import DataTypes, { Sequelize } from "sequelize";

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
export default (sequelize, dataTypes) => {
    const Location = sequelize.define('Location', {
        id: {
            type: dataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        latitude: {
            type: dataTypes.FLOAT,
        },
        longitude: {
            type: dataTypes.FLOAT,
        },
        altitude: {
            type: dataTypes.FLOAT.UNSIGNED,
        }
    }, {
        timestamps: false
    })

    return Location;
};
