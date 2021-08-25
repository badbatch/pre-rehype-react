import { Content, Element, Literal, Node } from "hast";
import { is } from "unist-util-is";

const makeClosingTagRegex = (tagName: string) => new RegExp(`^\\[\\/${tagName}\\]`);

export default (componentName: string, potentialChildren: Content[]) =>
  potentialChildren.findIndex((node: Node) => {
    if (!is(node, "element")) {
      return false;
    }

    const element = node as Element;

    if (!is(element.children[0], "text")) {
      return false;
    }

    return makeClosingTagRegex(componentName).test((element.children[0] as Literal).value);
  });
