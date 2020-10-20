import SignalStrengthReferences from "./SignalStrengthReferences";

/**
 * dBm is a negative number where:
 * -30 dBm is the maximum achievable signal strength. Heuristic show -42 is still an amazing, but realistic signal strength.
 * -90 dBm is unusable and approaching or drowning in the noise floor. Any functionality is highly unlikely.
 * @param {*} dBm
 * @return {SignalStrength}
 */
const DBMToSignalStrength = (dBm, showText=false) => {
  const references = SignalStrengthReferences();
  const defaultValueToReturn = references.find((e) => {
    return e.default === true;
  }).text;
  if ((typeof dBm !== "string" && typeof dBm !== "number") || dBm === "") {
    return defaultValueToReturn;
  }
  const num = Number.isFinite(dBm) ? dBm : Number(dBm);
    const foundCriteria = references.find((r) => {
      if (num >= r.value) {
        return r.text;
      } else {
        return undefined
      }
    });
    let returnValue =
      foundCriteria === undefined ? defaultValueToReturn : foundCriteria.text;
    if (showText) {
      return returnValue === "DISCONNECTED"
        ? "UNUSABLE"
        : returnValue === "UNUSABLE"
        ? "VERY WEAK"
        : returnValue;
    } else {
      return returnValue
    }
};

export default DBMToSignalStrength;