# pre-rehype-react

A rehype plugin to enable render of any React components in markdown.

[![codecov](https://codecov.io/gh/badbatch/pre-rehype-react/branch/main/graph/badge.svg)](https://codecov.io/gh/badbatch/pre-rehype-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://badge.fury.io/js/pre-rehype-react.svg)](https://badge.fury.io/js/pre-rehype-react)

## Installation

```bash
npm install pre-rehype-react
# or
yarn add pre-rehype-react
```

## Documentation

The plugin enables you to reference React components within markdown files using square bracket tags like in the example
below.

Any properties declared after the component name are passed in as props and any content within the opening
and closing tags are passed in as children.

Currently the plugin only accepts property values of type string, number and boolean, but this can be expanded to cover
all JSON serializable values.

```markdown
[callout accent=true marginBottom=5 type="error"]
#### This is a heading
This is a paragraph.
[/callout]
```

The plugin must be placed between `remark-rehype` and `rehype-react` in the `remark` pipeline like
in the example below.

Any components you want to reference witin markdown must be declared in the `pre-rehype-react` components array as well
as in the `rehype-react` components object.

```javascript
import preRehypeReact from "pre-rehype-react";
import rehypeReact from "rehype-react";
import remark from "remark";
import remarkRehype from "remark-rehype";
import Callout from "./components/Callout";

export default markdown => {
  const { result } = remark()
    .use(remarkRehype)
    .use(preRehypeReact, {
      components: ["callout"],
    })
    .use(rehypeReact, {
      callout: props => <Callout {...props}>,
    })
    .process(markdown);

  return result;
}
```

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

pre-rehype-react is [MIT Licensed](LICENSE).
