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
            allowNull: false
        },
        longitude: {
            type: dataTypes.FLOAT,
            allowNull: false
        },
        altitude: {
            type: dataTypes.FLOAT.UNSIGNED,
            allowNull: false
        }
    }, {
        timestamps: false
    })

    return Location;
};
