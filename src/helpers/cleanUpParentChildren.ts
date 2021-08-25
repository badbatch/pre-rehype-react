import { Parent } from "hast";
import { Indexes } from "../types";

export default (parent: Parent, { endIndex, startIndex }: Indexes) => {
  parent.children.splice(startIndex + 1, endIndex - startIndex);
};
