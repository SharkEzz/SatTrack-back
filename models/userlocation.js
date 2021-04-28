export default (sequelize, DataTypes) => {
    const UserLocation = sequelize.define(
        'userlocation',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            lat: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            lng: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            alt: {
                type: DataTypes.FLOAT.UNSIGNED,
                allowNull: false
            }
        }, 
        {
            createdAt: false,
            updatedAt: false,
        }
    );

    return UserLocation;
}
