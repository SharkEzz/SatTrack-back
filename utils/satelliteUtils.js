import { getSatelliteInfo, getVisibleSatellites, getSatelliteName, getChecksum2, computeChecksum } from "tle.js/dist/tlejs.esm.js";

export const isVisible = (tle, {lat, lng, alt}, time = new Date()) => {
    return getVisibleSatellites({
        observerLat: lat,
        observerLng: lng,
        observerHeight: alt,
        tles: [tle],
        elevationThreshold: 5,
        timestampMS: time
    }).length > 0;
}

export const getInfos = (tle, {lat, lng, alt}, time = new Date()) => {
    return {...getSatelliteInfo(
        tle, 
        time,
        lat,
        lng,
        alt 
        ),
        name: getSatelliteName(tle)
    };
}

export const getVisibles = (satellites, {lat, lng, alt}, time = new Date()) => {
    return satellites.map((satellite) => ({
        id: satellite.id,
        isVisible: isVisible(satellite.tle, {lat, lng, alt}, time),
        name: getSatelliteName(satellite.tle)
    })).filter((satellite) => satellite.isVisible);
}

export const checkTle = (tle) => {
    const tleArray = tle.split('\n');
    return getChecksum2(tle) === computeChecksum(tleArray[2]);
}
