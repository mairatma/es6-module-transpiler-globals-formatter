es6-module-transpiler-globals-formatter
===================================

ES6 Module Transpiler extension to output exported content as globals.

## Usage

Just set the `formatter` key to an instance of `GlobalFormatter`.
Remember to set the global name to be used first though.

```javascript
var GlobalsFormatter = require('es6-module-transpiler-globals-formatter');
var transpiler = require('es6-module-transpiler');
var Container = transpiler.Container;
var FileResolver = transpiler.FileResolver;

var container = new Container({
  resolvers: [new FileResolver(['lib/'])],
  formatter: new GlobalsFormatter({globalName: 'myGlobal'})
});

container.getModule('index');
container.write('out/mylib.js');
```
