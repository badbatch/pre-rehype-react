import { Element, ElementContent, Literal, Node, Root } from "hast";
import { is } from "unist-util-is";
import { visit } from "unist-util-visit";

const OPENING_TAG_REGEX = /^\[[A-Za-z0-9]+( [A-Za-z0-9]+="[A-Za-z0-9- ]+")*\]$/;
const CAPTURE_NAME_REGEX = /^\[([A-Za-z0-9]+)( [A-Za-z0-9]+="[A-Za-z0-9- ]+")*\]$/;
const CAPTURE_PROPS_REGEX = /^\[[A-Za-z0-9]+(( [A-Za-z0-9]+="[A-Za-z0-9- ]+)")*\]$/;
const makeClosingTagRegex = (tagName: string) => new RegExp(`^\\[\\/${tagName}\\]`);

export type Options = {
  components?: string[];
};

export default ({ components = [] }: Options = {}) => (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    if (
      node.tagName === "p" &&
      is(node.children[0], "text") &&
      OPENING_TAG_REGEX.test((node.children[0] as Literal).value)
    ) {
      const firstChild = node.children[0] as Literal;
      const nameCapture = CAPTURE_NAME_REGEX.exec(firstChild.value);

      if (nameCapture) {
        const [, componentName] = nameCapture;

        if (components.includes(componentName)) {
          const potentialChildren = node.children.length > 1 ? node.children : parent?.children;

          if (potentialChildren) {
            const closingTagIndex = potentialChildren.findIndex((potentialChild: Node) => {
              if (!is(potentialChild, "element")) {
                return false;
              }

              const childElement = potentialChild as Element;

              if (!(childElement.tagName === "p" && is(childElement.children[0], "text"))) {
                return false;
              }

              return makeClosingTagRegex(componentName).test((childElement.children[0] as Literal).value);
            });

            const propsCapture = CAPTURE_PROPS_REGEX.exec(firstChild.value);

            const properties = propsCapture
              ? propsCapture[1]
                  .trim()
                  .split(" ")
                  .reduce((acc: Record<string, string | number | boolean>, keyValuePair) => {
                    const [key, value] = keyValuePair.split("=");
                    acc[key] = JSON.parse(value);
                    return acc;
                  }, {})
              : {};

            if (node.children.length > 1) {
              node.children = node.children.slice(2, -2);
            } else {
              node.children = ((parent?.children || []) as ElementContent[])
                .splice((index as number) + 1, closingTagIndex - (index as number))
                .slice(1, -2);
            }

            node.properties = { ...(node.properties || {}), ...properties };
            node.tagName = componentName;
          }
        }
      }
    }
  });
};
