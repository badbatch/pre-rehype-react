import { Literal } from "hast";
import { Regexes } from "../types";

export const CAPTURE_NAME_REGEX = /^\[([A-Za-z0-9]+)( [A-Za-z0-9]+=("[A-Za-z0-9-_',. ]+"|true|false|\d+))*\]/;

export default (node: Literal, { captureName = CAPTURE_NAME_REGEX }: Regexes) => {
  return (captureName.exec(node.value) as RegExpExecArray)[1];
};
