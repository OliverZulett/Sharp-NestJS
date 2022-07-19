<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <h2 align="center">Image processor API</h2>

## Description

Image processor API, una API de procesamiento de imagenes construida con [Sharp](https://sharp.pixelplumbing.com) y [NestJS](https://nestjs.com).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger local
```bash
http://localhost:3322/api#/
```

## Docker execution

```bash
# build image
$ docker build -t image-processor:latest .

# execute container
$ docker run -p 3322:3322 --name image-processor-api --mount type=bind,source="$(pwd)"/images,target=/app/images image-processor:latest
```

## Stay in touch

- Autor - [Oliver Zulett](https://www.linkedin.com/in/joshzulett/)

