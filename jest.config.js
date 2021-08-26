const repodogConfig = require('@repodog/jest-config');

module.exports = {
  ...repodogConfig,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/types.ts', '!**/*.test.*', '!**/__tests__/**'],
  testMatch: ['<rootDir>/src/**/*.test.*'],
  transformIgnorePatterns: ['node_modules/(?!(unist-util-is|unist-util-visit|unist-util-visit-parents)/)'],
};
