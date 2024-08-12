module.exports = {
    testEnvironment: "jest-environment-jsdom",
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  };