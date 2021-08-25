export default class PreRehypeReactError extends Error {
  constructor(message: string) {
    super();
    this.message = `PreRehypeReactError: ${message}`;
  }
}
