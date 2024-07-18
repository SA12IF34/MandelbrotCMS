

/** @type {import(jest).Config} */
const config = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jsdom',
    verbose: true,
    transform: {
        "\\.[jt]sx?$": "babel-jest",
        "^.+\\.svg$": "<rootDir>/svgTransform.js",
        ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform" 
    }
}

module.exports = config;