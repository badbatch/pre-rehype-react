export const CAPTURE_NAME_REGEX = /^\[([A-Za-z0-9]+)( [A-Za-z0-9]+=("[A-Za-z0-9-_',.?!/ ]+"|true|false|\d+))*\]/;

export const CAPTURE_PROPS_REGEX = /^\[[A-Za-z0-9]+(( [A-Za-z0-9]+=("[A-Za-z0-9-_',.?!/ ]+"|true|false|\d+))*)\]/;

export const CLOSING_TAG_TEMPLATE = "^\\[\\/${componentName}\\]"; // tslint:disable-line:no-invalid-template-strings

export const OPENING_TAG_REGEX = /^\[[A-Za-z0-9]+( [A-Za-z0-9]+=("[A-Za-z0-9-_',.?!/ ]+"|true|false|\d+))*\]$/;

export const SPLIT_PROPS_REGEX = /([A-Za-z0-9]+="[A-Za-z0-9-_',.?!/ ]+"|[A-Za-z0-9]+=true|[A-Za-z0-9]+=false|[A-Za-z0-9]+=\d+)/;
