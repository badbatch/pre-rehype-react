import { Element, Parent } from "hast";

export default (node: Element, parent: Parent | null) => node.children.length === 1 && !!parent;
