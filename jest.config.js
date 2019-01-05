module.exports = {
  preset: 'ts-jest',
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/lib/"
  ],
  testMatch: null,
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  "coverageDirectory": "coverage",
  "setupTestFrameworkScriptFile": "<rootDir>config/jest/setupTests.ts"
};
