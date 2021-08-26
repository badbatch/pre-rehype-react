import { Literal, Properties } from "hast";

export const CAPTURE_PROPS_REGEX = /^\[[A-Za-z0-9]+(( [A-Za-z0-9]+=("[A-Za-z0-9-_',. ]+"|true|false|\d+))*)\]/;
export const PROPS_SPLIT_REGEX = /([A-Za-z0-9]+="[A-Za-z0-9-_',. ]+"|[A-Za-z0-9]+=true|[A-Za-z0-9]+=false|[A-Za-z0-9]+=\d+)/;

export default (node: Literal) => {
  const propsCapture = CAPTURE_PROPS_REGEX.exec(node.value) as RegExpExecArray;

  if (!propsCapture[1]) {
    return {};
  }

  return propsCapture[1]
    .trim()
    .split(PROPS_SPLIT_REGEX)
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
