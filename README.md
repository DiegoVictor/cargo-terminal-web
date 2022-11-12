# [Web] Cargo Terminal
[![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/cargo-terminal-web?style=flat-square&logo=circleci)](https://app.circleci.com/pipelines/github/DiegoVictor/cargo-terminal-web)
[![react](https://img.shields.io/badge/reactjs-18.2.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-5.3.6-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-8.26.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-27.5.1-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/cargo-terminal-web?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/cargo-terminal-web)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
# About
Project built to manage vehicles that arrive at a terminal, it permits users to register drivers, vehicles and drivers' origins and destinations.

# Install
```
$ yarn
```

# Dependencies
Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# .env
Rename the `.env.example` to `.env` then just update with yours settings.

# API
Start the server in the [`api`](https://github.com/DiegoVictor/truck-system/tree/master/api) folder (see its README for more information). If any change in the api's port or host was made remember to update the .env too.

# Start up
```
$ yarn start
```

# Tests
```
$ yarn test
```
> And `yarn coverage` to run tests with coverage
