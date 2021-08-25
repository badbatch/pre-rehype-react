export type Environment = "development" | "production";

export type Indexes = {
  endIndex: number;
  startIndex: number;
};

export type Options = {
  components?: string[];
  environment?: Environment;
};
