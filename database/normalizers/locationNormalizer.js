export const itemNormalizer = (location) => {

    if(location.latitude && location.longitude && location.altitude)
    {
        return {
            latitude: location.latitude,
            longitude: location.longitude,
            altitude: location.altitude
        }
    }
    else
        return null;

    
};
