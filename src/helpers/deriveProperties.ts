import { Literal, Properties } from "hast";
import { CAPTURE_PROPS_REGEX, SPLIT_PROPS_REGEX } from "../regexes";
import { Regexes } from "../types";

export default (node: Literal, { captureProps = CAPTURE_PROPS_REGEX, splitProps = SPLIT_PROPS_REGEX }: Regexes) => {
  const propsCapture = captureProps.exec(node.value) as RegExpExecArray;

  if (!propsCapture[1]) {
    return {};
  }

  return propsCapture[1]
    .trim()
    .split(splitProps)
    .reduce((acc, split) => {
      if (split.trim()) {
        acc.push(split);
      }

      return acc;
    }, [] as string[])
    .reduce((acc: Properties, keyValuePair) => {
      const [key, value] = keyValuePair.split("=");
      acc[key] = JSON.parse(value);
      return acc;
    }, {});
};
