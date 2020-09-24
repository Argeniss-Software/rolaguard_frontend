import { SignalStrength } from "react-wifi-indicator";

/**
 * define scale references of signal strength for use in react wifi indicator
 * @return {SignalStrengthReferences}
 */
const SignalStrengthReferences = () => {
  return [
      { value: -50, unit: "dBm", text: SignalStrength.EXCELLENT, default:false },
      { value: -75, unit: "dBm", text: SignalStrength.GREAT, default:false },
      { value: -100, unit: "dBm", text: SignalStrength.OKAY, default:false },
      { value: -110, unit: "dBm", text: SignalStrength.WEAK, default:false },
      { value: -120, unit: "dBm", text: SignalStrength.UNUSABLE, default:false },
      { value: -120, unit: "dBm", text: SignalStrength.DISCONNECTED, default: true }
    ]
}

export default SignalStrengthReferences;