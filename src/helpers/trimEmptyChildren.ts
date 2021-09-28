import { Element, ElementContent, Literal } from "hast";
import { is } from "unist-util-is";

const trimEmptyChildren = (children: ElementContent[]) => {
  let hasChanged = false;

  if (
    (is(children[0], "text") && (children[0] as Literal).value === "\n") ||
    (is(children[0], "element") && (children[0] as Element).tagName === "br")
  ) {
    children.shift();
    hasChanged = true;
  }

  const lastIndex = children.length - 1;

  if (
    (is(children[lastIndex], "text") && (children[lastIndex] as Literal).value === "\n") ||
    (is(children[lastIndex], "element") && (children[lastIndex] as Element).tagName === "br")
  ) {
    children.pop();
    hasChanged = true;
  }

  if (hasChanged) {
    return trimEmptyChildren(children);
  }

  return children;
};

export default (children: ElementContent[]) => trimEmptyChildren(children);
