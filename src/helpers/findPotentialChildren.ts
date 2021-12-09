import { Element, ElementContent, Parent } from "hast";
import { Regexes } from "../types";
import findClosingTagIndex from "./findClosingTagIndex";

export default (
  node: Element,
  index: number | null,
  parent: Parent | null,
  componentName: string,
  regexes: Regexes,
) => {
  const startingTaxIndex = index ?? 0;

  if (!parent) {
    return { fromParent: false, potentialChildren: node.children, startingTaxIndex };
  }

  if (node.children.length === 1) {
    return { fromParent: true, potentialChildren: parent.children, startingTaxIndex };
  }

  const nodeChildrenHasClosingTag = findClosingTagIndex(componentName, node.children, regexes) !== -1;

  if (nodeChildrenHasClosingTag) {
    return { fromParent: false, potentialChildren: node.children, startingTaxIndex: 0 };
  }

  const parentIndexThatHasClosingTag = parent.children.findIndex(child => {
    if ("children" in child) {
      return findClosingTagIndex(componentName, child.children, regexes) !== -1;
    }

    return false;
  });

  if (parentIndexThatHasClosingTag === -1) {
    return { fromParent: false, potentialChildren: node.children, startingTaxIndex: 0 };
  }

  return {
    fromParent: true,
    parentClosingTagIndex: parentIndexThatHasClosingTag,
    potentialChildren: [
      ...node.children,
      ...parent.children.slice((index as number) + 1, parentIndexThatHasClosingTag),
      ...(parent.children[parentIndexThatHasClosingTag] as Element).children,
    ] as ElementContent[],
    startingTaxIndex,
  };
};
