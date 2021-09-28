import { ElementContent } from "hast";
import { Indexes } from "../types";
import trimEmptyChildren from "./trimEmptyChildren";

export default (potentialChildren: ElementContent[], { endIndex, startIndex }: Indexes) =>
  trimEmptyChildren(potentialChildren.slice(startIndex + 1, endIndex));
