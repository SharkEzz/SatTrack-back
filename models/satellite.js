export default (sequelize, DataTypes) => {
    const Satellite = sequelize.define(
        'satellite',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            tle: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }
    );
    return Satellite;
}
