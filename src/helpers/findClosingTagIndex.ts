import { Content, Element, Literal, Node } from "hast";
import { template } from "lodash";
import { is } from "unist-util-is";
import { CLOSING_TAG_TEMPLATE } from "../regexes";
import { Regexes } from "../types";

export default (componentName: string, potentialChildren: Content[], { closingTag = CLOSING_TAG_TEMPLATE }: Regexes) =>
  potentialChildren.findIndex((node: Node) => {
    if (is(node, "text") || (is(node, "element") && is((node as Element).children[0], "text"))) {
      const regex = template(closingTag)({ componentName });

      if (is(node, "text")) {
        return new RegExp(regex).test((node as Literal).value);
      }

      return new RegExp(regex).test(((node as Element).children[0] as Literal).value);
    }

    return false;
  });
