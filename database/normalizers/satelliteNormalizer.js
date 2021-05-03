import { getSatelliteName } from 'tle.js/dist/tlejs.esm.js';

export const collectionNormalizer = (satellites) => {
    return satellites.map(satellite => ({
        id: satellite.id,
        name: getSatelliteName(satellite.tle)
    }))
};

export const itemNormalizer = (satellite) => {

};
