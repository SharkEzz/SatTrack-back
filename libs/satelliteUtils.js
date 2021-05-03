import { getChecksum2, getChecksum1, computeChecksum, getSatelliteInfo, getSatelliteName, getVisibleSatellites } from 'tle.js/dist/tlejs.esm.js';

/**
 * Check if a given TLE is valid
 * 
 * @param {String} tle 
 * @returns {Boolean} True if the TLE is valid, false otherwise
 */
export const validateTle = (tle) => {
    const tleArray = tle.split('\n');

    if(tleArray.length !== 3)
        return false;

    const expectedChecksum1 = getChecksum1(tle);
    const computedChecksum1 = computeChecksum(tleArray[1]);
    const expectedChecksum2 = getChecksum2(tle);
    const computedChecksum2 = computeChecksum(tleArray[2]);

    return expectedChecksum1 === computedChecksum1 && expectedChecksum2 === computedChecksum2;
};

/**
 * Return the informations of a satellite (elevation, azimuth, etc...)
 * 
 * @param {String} tle 
 * @param {{
 *  latitude: Number,
 *  longitude: Number,
 *  altitude: Number
 * }} param1 
 * @param {Date} date 
 */
export const getSatInfos = (tle, { latitude, longitude, altitude }, date = new Date()) => {
    return {
        name: getSatelliteName(tle),
        ...getSatelliteInfo(tle, date, latitude, longitude, altitude),
        isVisible: isSatelliteVisible(tle, {latitude, longitude, altitude}, date)
    }
};

/**
 * 
 * @param {String} tle 
 * @param {{
 *  latitude: Number,
 *  longitude: Number,
 *  altitude: Number,
 * }} param1 
 * @param {Date} date 
 */
export const isSatelliteVisible = (tle, { latitude, longitude, altitude }, date = new Date()) => {
    const visible = getVisibleSatellites({
        observerLat: latitude,
        observerLng: longitude,
        observerHeight: altitude,
        tles: [tle],
        timestampMS: date,
        elevationThreshold: 0
    });

    return visible.length === 1; 
};
