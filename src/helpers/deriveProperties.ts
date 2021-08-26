import { Literal, Properties } from "hast";
import { Regexes } from "../types";

export const CAPTURE_PROPS_REGEX = /^\[[A-Za-z0-9]+(( [A-Za-z0-9]+=("[A-Za-z0-9-_',. ]+"|true|false|\d+))*)\]/;
export const SPLIT_PROPS_REGEX = /([A-Za-z0-9]+="[A-Za-z0-9-_',. ]+"|[A-Za-z0-9]+=true|[A-Za-z0-9]+=false|[A-Za-z0-9]+=\d+)/;

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
