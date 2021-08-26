import { ElementContent, Literal, Parent, Root } from "hast";
import { visit } from "unist-util-visit";
import PreRehypeReactError from "./errors/PreRehypeReactError";
import areChildrenFromParent from "./helpers/areChildrenFromParent";
import cleanUpParentChildren from "./helpers/cleanUpParentChildren";
import deriveName, { CAPTURE_NAME_REGEX } from "./helpers/deriveName";
import deriveProperties from "./helpers/deriveProperties";
import findClosingTagIndex from "./helpers/findClosingTagIndex";
import findComponentChildren from "./helpers/findComponentChildren";
import findPotentialChildren from "./helpers/findPotentialChildren";
import isDevelopment from "./helpers/isDevelopment";
import isOpeningTagNode from "./helpers/isOpeningTagNode";
import { Options } from "./types";

export default ({ components = [], environment = "development" }: Options = {}) => (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    try {
      if (isOpeningTagNode(node)) {
        const firstChild = node.children[0] as Literal;
        const componentName = deriveName(firstChild);

        if (!componentName) {
          throw new PreRehypeReactError(
            `It was not possible to derive the component name from: ${
              firstChild.value
            }. The tag must meet these regex requirements: ${CAPTURE_NAME_REGEX.toString()}`,
          );
        }

        if (!components.includes(componentName)) {
          throw new PreRehypeReactError(
            `${componentName} is not whitelisted for use in markdown files. To whitelist, please add ${componentName} to the 'components' array.`,
          );
        }

        const potentialChildren = findPotentialChildren(node, parent as Parent);
        const closingTagIndex = findClosingTagIndex(componentName, potentialChildren);

        if (closingTagIndex === -1) {
          throw new PreRehypeReactError(
            `${componentName} has no valid closing tag. It should be [/${componentName}] and be on its own line in the markdown file.`,
          );
        }

        const { properties, errors } = deriveProperties(firstChild);

        if (errors.length) {
          throw errors;
        }

        const children = findComponentChildren(potentialChildren as ElementContent[], {
          endIndex: closingTagIndex,
          startIndex: index ?? 0,
        });

        if (areChildrenFromParent(node, parent as Parent)) {
          cleanUpParentChildren(parent as Parent, {
            endIndex: closingTagIndex,
            startIndex: index ?? 0,
          });
        }

        node.children = children;
        node.properties = { ...(node.properties ?? {}), ...properties };
        node.tagName = componentName;
      }
    } catch (e) {
      if (isDevelopment(environment)) {
        console.error(e); // tslint:disable-line:no-console
      }
    }
  });
};
