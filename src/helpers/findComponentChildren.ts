import { ElementContent } from "hast";
import { Indexes } from "../types";

export default (potentialChildren: ElementContent[], { endIndex, startIndex }: Indexes) => {
  return potentialChildren.slice(startIndex + 2, endIndex - 1);
};
