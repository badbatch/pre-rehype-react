import { Element, Literal } from "hast";
import { is } from "unist-util-is";
import { Regexes } from "../types";

export const OPENING_TAG_REGEX = /^\[[A-Za-z0-9]+( [A-Za-z0-9]+=("[A-Za-z0-9-_',.?! ]+"|true|false|\d+))*\]$/;

export default (node: Element, { openingTag = OPENING_TAG_REGEX }: Regexes) =>
  is(node.children[0], "text") && openingTag.test((node.children[0] as Literal).value);
