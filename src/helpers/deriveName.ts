import { Literal } from "hast";
import { CAPTURE_NAME_REGEX } from "../regexes";
import { Regexes } from "../types";

export default (node: Literal, { captureName = CAPTURE_NAME_REGEX }: Regexes) => {
  return (captureName.exec(node.value) as RegExpExecArray)[1];
};
