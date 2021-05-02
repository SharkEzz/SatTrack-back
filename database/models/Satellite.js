import DataTypes, { Sequelize } from "sequelize";

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} dataTypes
 */
export default (sequelize, dataTypes) => {
    const Satellite = sequelize.define('Satellite', {
        id: {
            type: dataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tle: {
            type: dataTypes.STRING,
            allowNull: false
        }
    })

    return Satellite;
};
