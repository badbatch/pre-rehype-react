import { Literal } from "hast";

export const CAPTURE_NAME_REGEX = /^\[([A-Za-z0-9]+)( [A-Za-z0-9]+=("[A-Za-z0-9-_',. ]+"|true|false|\d+))*\]/;

export default (node: Literal) => {
  return (CAPTURE_NAME_REGEX.exec(node.value) as RegExpExecArray)[1];
};
