import { getChecksum2, getChecksum1, computeChecksum } from 'tle.js/dist/tlejs.esm.js';

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
