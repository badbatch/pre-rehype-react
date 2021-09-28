import { ElementContent, Literal, Parent, Root } from "hast";
import { isUndefined } from "lodash";
import { visit } from "unist-util-visit";
import PreRehypeReactError from "./errors/PreRehypeReactError";
import cleanUpParentChildren from "./helpers/cleanUpParentChildren";
import deriveName from "./helpers/deriveName";
import deriveProperties from "./helpers/deriveProperties";
import findClosingTagIndex from "./helpers/findClosingTagIndex";
import findComponentChildren from "./helpers/findComponentChildren";
import findPotentialChildren from "./helpers/findPotentialChildren";
import isDevelopment from "./helpers/isDevelopment";
import isOpeningTagNode from "./helpers/isOpeningTagNode";
import { Options } from "./types";

export default ({ components = [], environment = "development", regexes = {} }: Options = {}) => (tree: Root) => {
  visit(tree, "element", (node, index, parent) => {
    try {
      if (isOpeningTagNode(node, regexes)) {
        const firstChild = node.children[0] as Literal;
        const componentName = deriveName(firstChild, regexes);

        if (!components.includes(componentName)) {
          throw new PreRehypeReactError(
            `${componentName} is not whitelisted for use in markdown files. To whitelist, please add ${componentName} to the 'components' array.`,
          );
        }

        const { fromParent, parentClosingTagIndex, potentialChildren } = findPotentialChildren(
          node,
          index,
          parent as Parent,
          componentName,
          regexes,
        );

        const closingTagIndex = findClosingTagIndex(componentName, potentialChildren, regexes);

        if (closingTagIndex === -1) {
          throw new PreRehypeReactError(
            `${componentName} has no valid closing tag. It should be [/${componentName}] and be on its own line in the markdown file.`,
          );
        }

        const properties = deriveProperties(firstChild, regexes);

        const children = findComponentChildren(potentialChildren as ElementContent[], {
          endIndex: closingTagIndex,
          startIndex: index ?? 0,
        });

        if (fromParent) {
          cleanUpParentChildren(parent as Parent, {
            endIndex: isUndefined(parentClosingTagIndex) ? closingTagIndex : parentClosingTagIndex,
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
