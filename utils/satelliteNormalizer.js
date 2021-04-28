import { getSatelliteName, getLatLngObj } from "tle.js/dist/tlejs.esm.js";

export const collectionNormalize = (satellites) => {
    console.log(satellites[0].tle);
    return satellites.map((satellite) => ({
        id: satellite.id,
        name: getSatelliteName(satellite.tle)
    }));
}

export const itemNormalize = (satellite) => {
    return {
        id: satellite.id,
        name: getSatelliteName(satellite.tle),
        location: getLatLngObj(satellite.tle)
    };
}
