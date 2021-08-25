import { Literal, Properties } from "hast";
import { isString } from "lodash";
import PreRehypeReactError from "../errors/PreRehypeReactError";

export const CAPTURE_PROPS_REGEX = /^\[[A-Za-z0-9]+(( [A-Za-z0-9]+="[A-Za-z0-9- ]+)")*\]$/;

export default (node: Literal) => {
  const propsCapture = CAPTURE_PROPS_REGEX.exec(node.value);
  const errors: PreRehypeReactError[] = [];

  if (!propsCapture) {
    return { properties: {}, errors };
  }

  const properties = propsCapture[1]
    .trim()
    .split(" ")
    .reduce((acc: Properties, keyValuePair) => {
      const [key, value] = keyValuePair.split("=");

      if (isString(key) && isString(value)) {
        acc[key] = JSON.parse(value);
      } else {
        errors.push(new PreRehypeReactError(`It was not possible to drive properties from: ${keyValuePair}`));
      }

      return acc;
    }, {});

  return { properties, errors };
};
