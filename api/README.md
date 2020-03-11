# Install
```
$ yarn
```

# Dependencies
Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# Databases
The application use one database: MongoDB. For the fastest setup is recommended to use docker, see how to do it below.
> Windows users using Docker Toolbox, maybe be necessary in your `env` file set the MongoDB' host to `192.168.99.100` (docker machine IP) instead of `localhost` or `127.0.0.1`

## MongoDB
```
$ docker run --name truck-system-mongo -d -p 27017:27017 mongo
$ docker start truck-system-mongo
```

# .env
Rename the `.env.example` to `.env` then just update with yours settings.

# Start Up
```
$ yarn dev
```

# Tests
```
$ yarn test
```
