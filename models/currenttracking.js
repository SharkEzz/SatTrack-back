export default (sequelize, DataTypes) => {
    const CurrentTracking = sequelize.define(
        'currenttracking',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        }
    );

    CurrentTracking.associate = models => {
        CurrentTracking.belongsTo(models.satellite);
    }

    return CurrentTracking;
}
