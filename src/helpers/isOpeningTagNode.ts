import { Element, Literal } from "hast";
import { is } from "unist-util-is";
import { OPENING_TAG_REGEX } from "../regexes";
import { Regexes } from "../types";

export default (node: Element, { openingTag = OPENING_TAG_REGEX }: Regexes) =>
  is(node.children[0], "text") && openingTag.test((node.children[0] as Literal).value);
