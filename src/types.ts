export type Environment = "development" | "production";

export type Indexes = {
  endIndex: number;
  startIndex: number;
};

export type Options = {
  components?: string[];
  environment?: Environment;
  regexes?: Regexes;
};

export type Regexes = {
  captureName?: RegExp;
  captureProps?: RegExp;
  closingTag?: string;
  openingTag?: RegExp;
  splitProps?: RegExp;
};
