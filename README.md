# [Web] Cargo Terminal
[![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/cargo-terminal-web?style=flat-square&logo=circleci)](https://app.circleci.com/pipelines/github/DiegoVictor/cargo-terminal-web)
[![react](https://img.shields.io/badge/reactjs-18.2.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-5.3.6-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-8.26.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-27.5.1-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/cargo-terminal-web?logo=codecov&style=flat-square)](https://app.codecov.io/gh/DiegoVictor/cargo-terminal-web/tree/main)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Project built to manage vehicles that arrive at a terminal, it permits users to register drivers, vehicles and drivers' origins and destinations. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/cargo-terminal-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
* [Running the tests](#running-the-tests)
  * [Coverage Report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/terminal.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/terminal-edit.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/travels.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/drivers.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/driver-edit.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/driver-disable.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/vehicles.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/cargo-terminal-web/main/screenshots/vehicle-edit.png" width="49%"/>

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/cargo-terminal-api) before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
REACT_APP_API_URL|API's url|`http://localhost:3333`

### API
Start the [API](https://github.com/DiegoVictor/cargo-terminal-api) (see its README for more information). In case of any change in the API's `port` or `host` remember to update the [`.env`](#env) too.

# Usage
To start the app run:
```
$ yarn start
```
Or:
```
npm run start
```

# Tests
```
$ yarn test
```
> And `yarn coverage` to run tests with coverage
