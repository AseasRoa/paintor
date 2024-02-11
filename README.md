### Install everything that is necessary
```
npm install
npm run build
```

### Start the server
```
npm run server
```
http://localhost:8080/frameworks/keyed/vanillajs/index.html

http://localhost:8080/frameworks/keyed/paintor/index.html

### Run benchmarks
```
npm run bench keyed/vanillajs
npm run bench keyed/paintor
```

### Benchmark other frameworks
For example, to benchmark Vue:
```
cd dist/js-framework-benchmark/frameworks/keyed/vue
npm ci
npm run build-prod
cd ../../../
npm run bench keyed/vue
```

### Show the results
```
npm run results
```
And then open this page:
http://localhost:8080/webdriver-ts-results/dist/index.html
