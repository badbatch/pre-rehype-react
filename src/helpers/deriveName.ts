import { Literal } from "hast";

export const CAPTURE_NAME_REGEX = /^\[([A-Za-z0-9]+)( [A-Za-z0-9]+="[A-Za-z0-9- ]+")*\]$/;

export default (node: Literal) => {
  const nameCapture = CAPTURE_NAME_REGEX.exec(node.value);
  return nameCapture ? nameCapture[1] : null;
};
