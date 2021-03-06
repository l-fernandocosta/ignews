module.exports = async () => {
  return {
    verbose: true,
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    setupFilesAfterEnv: [
      "<rootDir>/src/tests/setupTests.ts"
    ],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    moduleNameMapper: {
      "\\.(css|less|scss)$": "identity-obj-proxy"
    }
  }
}

