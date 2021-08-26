import { Element, Literal } from "hast";
import { is } from "unist-util-is";

export const OPENING_TAG_REGEX = /^\[[A-Za-z0-9]+( [A-Za-z0-9]+=("[A-Za-z0-9-_',. ]+"|true|false|\d+))*\]$/;

export default (node: Element) =>
  is(node.children[0], "text") && OPENING_TAG_REGEX.test((node.children[0] as Literal).value);
