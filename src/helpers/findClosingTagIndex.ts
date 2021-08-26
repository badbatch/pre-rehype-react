import { Content, Element, Literal, Node } from "hast";
import { template } from "lodash";
import { is } from "unist-util-is";
import { Regexes } from "../types";

export const CLOSING_TAG_TEMPLATE = "^\\[\\/${componentName}\\]"; // tslint:disable-line:no-invalid-template-strings

export default (componentName: string, potentialChildren: Content[], { closingTag = CLOSING_TAG_TEMPLATE }: Regexes) =>
  potentialChildren.findIndex((node: Node) => {
    if (!is(node, "element")) {
      return false;
    }

    const element = node as Element;

    if (!is(element.children[0], "text")) {
      return false;
    }

    const regex = template(closingTag)({ componentName });
    return new RegExp(regex).test((element.children[0] as Literal).value);
  });
