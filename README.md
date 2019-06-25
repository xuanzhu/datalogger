# Datalogger Next

## Prerequisites

- [NodeJS LTS](https://nodejs.org/en/)
- [Angular CLI](https://angular.io/cli), install globally with `npm install -g @angular/cli`

## Interesting docs

- <https://angular.io/cli>
  (command line commands to create components etc)
- <https://www.learnrxjs.io/>
  (lots of examples how to work with RxJS)
- <https://ng-bootstrap.github.io/>
  (Angular directives for Bootstrap components)
- <https://www.ag-grid.com/javascript-grid-reference-overview/>
  (documentation of the grid we're using)

## Installation

Install javascript dependencies:

```js
npm install --proxy http://prx01.allseas.global:8082
```

## Development

Run development server that watches for changes:

```js
npm start
```

In case of port 8080 conflict use:

```js
ng serve --port 8081
```

Run unit tests:

```js
npm run test
```

Run lint tests:

```js
ng lint
```

## Build

Execute production build (including AOT compilation):

```js
npm run build
```
