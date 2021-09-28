import { castArray, cloneDeep } from "lodash";
import preRehypeReact from "./main";

/* tslint:disable:no-console */

const makeRootNode = ({ children = [] }) => ({
  children,
  type: "root",
});

const makeElementNode = ({ children = [], properties = {}, tagName = "div" } = {}) => ({
  children,
  properties,
  tagName,
  type: "element",
});

const makeTextNode = ({ value = "\n" }) => ({
  type: "text",
  value,
});

const makeNodeMap = {
  element: makeElementNode,
  root: makeRootNode,
  text: makeTextNode,
};

const makeTree = (config = []) => {
  const makeNode = (c = []) => {
    const [name, options = {}] = castArray(c);
    const node = makeNodeMap[name](options);

    if (options.children) {
      node.children = options.children.map(child => makeNode(child));
    }

    return node;
  };

  return makeNode(["root", { children: config }]);
};

describe("preRehypeReact", () => {
  let consoleError: (...data: any[]) => void;

  beforeEach(() => {
    consoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = consoleError;
  });

  test("when no matching opening tag exists", () => {
    const tree = makeTree(["element", "text", "element", "text", "element"]);
    const clone = cloneDeep(tree);
    preRehypeReact({ components: ["callout"] })(tree);
    expect(tree).toEqual(clone);
  });

  test("when matching opening tag is not structured correctly", () => {
    const tree = makeTree([
      "element",
      "text",
      ["element", { children: [["text", { value: "[alpha errors=[]]" }]] }],
      "text",
      "element",
    ]);

    const clone = cloneDeep(tree);
    preRehypeReact({ components: ["callout"] })(tree);
    expect(tree).toEqual(clone);
  });

  test("when matching opening tag is not in the component whitelist", () => {
    const tree = makeTree([
      "element",
      "text",
      ["element", { children: [["text", { value: "[alpha]" }]] }],
      "text",
      "element",
    ]);

    const clone = cloneDeep(tree);
    preRehypeReact({ components: ["callout"] })(tree);
    expect(tree).toEqual(clone);

    expect(console.error).toHaveBeenCalledWith(
      new Error(
        "PreRehypeReactError: alpha is not whitelisted for use in markdown files. To whitelist, please add alpha to the 'components' array.",
      ),
    );
  });

  test("when matching closing tag is missing", () => {
    const tree = makeTree([
      "element",
      "text",
      ["element", { children: [["text", { value: "[callout]" }]] }],
      "text",
      "element",
    ]);

    const clone = cloneDeep(tree);
    preRehypeReact({ components: ["callout"] })(tree);
    expect(tree).toEqual(clone);

    expect(console.error).toHaveBeenCalledWith(
      new Error(
        "PreRehypeReactError: callout has no valid closing tag. It should be [/callout] and be on its own line in the markdown file.",
      ),
    );
  });

  describe("when component is parsed correctly", () => {
    test("when the component markdown is split into separate nodes", () => {
      const tree = makeTree([
        "element",
        "text",
        ["element", { children: [["text", { value: "[callout]" }]] }],
        ["element", { tagName: "br" }],
        "text",
        ["element", { children: [["text", { value: "This is a heading" }]], tagName: "h4" }],
        "text",
        ["element", { children: [["text", { value: "This is a paragraph" }]], tagName: "p" }],
        "text",
        ["element", { tagName: "br" }],
        ["element", { children: [["text", { value: "[/callout]" }]] }],
        "text",
        "element",
      ]);

      preRehypeReact({ components: ["callout"] })(tree);

      expect(tree).toEqual({
        children: [
          {
            children: [],
            properties: {},
            tagName: "div",
            type: "element",
          },
          {
            type: "text",
            value: "\n",
          },
          {
            children: [
              {
                children: [
                  {
                    type: "text",
                    value: "This is a heading",
                  },
                ],
                properties: {},
                tagName: "h4",
                type: "element",
              },
              {
                type: "text",
                value: "\n",
              },
              {
                children: [
                  {
                    type: "text",
                    value: "This is a paragraph",
                  },
                ],
                properties: {},
                tagName: "p",
                type: "element",
              },
            ],
            properties: {},
            tagName: "callout",
            type: "element",
          },
          {
            type: "text",
            value: "\n",
          },
          {
            children: [],
            properties: {},
            tagName: "div",
            type: "element",
          },
        ],
        type: "root",
      });
    });

    test("when the component markdown is NOT split into separate nodes", () => {
      const tree = makeTree([
        [
          "element",
          {
            children: [
              ["text", { value: "[callout]" }],
              ["element", { tagName: "br" }],
              ["element", { children: [["text", { value: "This is a heading" }]], tagName: "h4" }],
              "text",
              ["element", { children: [["text", { value: "This is a paragraph" }]], tagName: "p" }],
              "text",
              ["element", { tagName: "br" }],
              ["text", { value: "[/callout]" }],
            ],
          },
        ],
      ]);

      preRehypeReact({ components: ["callout"] })(tree);

      expect(tree).toEqual({
        children: [
          {
            children: [
              {
                children: [
                  {
                    type: "text",
                    value: "This is a heading",
                  },
                ],
                properties: {},
                tagName: "h4",
                type: "element",
              },
              {
                type: "text",
                value: "\n",
              },
              {
                children: [
                  {
                    type: "text",
                    value: "This is a paragraph",
                  },
                ],
                properties: {},
                tagName: "p",
                type: "element",
              },
            ],
            properties: {},
            tagName: "callout",
            type: "element",
          },
        ],
        type: "root",
      });
    });
  });

  test("when component is parsed correctly with properties", () => {
    const tree = makeTree([
      "element",
      "text",
      [
        "element",
        {
          children: [
            [
              "text",
              {
                value:
                  '[callout type="error" message="This is a message, I hope this still works." hide=false max=999]',
              },
            ],
          ],
        },
      ],
      "text",
      ["element", { children: [["text", { value: "This is a heading" }]], tagName: "h4" }],
      "text",
      ["element", { children: [["text", { value: "This is a paragraph" }]], tagName: "p" }],
      "text",
      ["element", { tagName: "br" }],
      ["element", { children: [["text", { value: "[/callout]" }]] }],
      "text",
      "element",
    ]);

    preRehypeReact({ components: ["callout"] })(tree);

    expect(tree).toEqual({
      children: [
        {
          children: [],
          properties: {},
          tagName: "div",
          type: "element",
        },
        {
          type: "text",
          value: "\n",
        },
        {
          children: [
            {
              children: [
                {
                  type: "text",
                  value: "This is a heading",
                },
              ],
              properties: {},
              tagName: "h4",
              type: "element",
            },
            {
              type: "text",
              value: "\n",
            },
            {
              children: [
                {
                  type: "text",
                  value: "This is a paragraph",
                },
              ],
              properties: {},
              tagName: "p",
              type: "element",
            },
          ],
          properties: {
            hide: false,
            max: 999,
            message: "This is a message, I hope this still works.",
            type: "error",
          },
          tagName: "callout",
          type: "element",
        },
        {
          type: "text",
          value: "\n",
        },
        {
          children: [],
          properties: {},
          tagName: "div",
          type: "element",
        },
      ],
      type: "root",
    });
  });

  test("when the component markdown has been separated into separate nodes", () => {
    const tree = makeTree([
      [
        "element",
        {
          children: [
            [
              "text",
              {
                value: '[expander title="Expander title"]',
              },
            ],
            [
              "element",
              {
                tagName: "br",
              },
            ],
            "text",
            [
              "text",
              {
                value: "First paragraph of text",
              },
            ],
          ],
        },
      ],
      "text",
      [
        "element",
        {
          children: [
            [
              "text",
              {
                value: "Second paragraph of text",
              },
            ],
            [
              "element",
              {
                tagName: "br",
              },
            ],
            "text",
            [
              "text",
              {
                value: "[/expander]",
              },
            ],
          ],
        },
      ],
    ]);

    preRehypeReact({ components: ["expander"] })(tree);

    expect(tree).toEqual({
      children: [
        {
          children: [
            {
              type: "text",
              value: "First paragraph of text",
            },
            {
              type: "text",
              value: "\n",
            },
            {
              type: "text",
              value: "Second paragraph of text",
            },
          ],
          properties: {
            title: "Expander title",
          },
          tagName: "expander",
          type: "element",
        },
      ],
      type: "root",
    });
  });
});
