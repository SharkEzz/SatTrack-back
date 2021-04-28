import { getSatelliteInfo, getVisibleSatellites } from "tle.js/dist/tlejs.esm.js";

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
    return getSatelliteInfo(
        tle, 
        time,
        lat,
        lng,
        alt 
        );
}

export const getVisibles = (satellites, {lat, lng, alt}, time = new Date()) => {
    return getVisibleSatellites({
        observerLat: lat,
        observerLng: lng,
        observerHeight: alt,
        tles: satellites.map((s) => s.tle),
        elevationThreshold: 5,
        timestampMS: time
    });
}
