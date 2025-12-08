// helpers.js
const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const ageDifMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};
export {calculateAge}
