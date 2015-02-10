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

## Output

The output file is basically the same delivered by the original `BundleFormatter`, with the addition of global assignments for exported values at the end.

All exported values will be added inside a single object in the global scope with the name specified by the `globalName` configuration option. The keys of this object will be the names of the variables that were exported, so note that there may be conflicts.

For example, say we have the following export declarations:

```javascript
// foo/foo.js
var foo = 1;
export default foo;

// foo/bar.js
import foo from 'foo';

var bar = foo + 1;
export {bar};
```

The output bundle file's contents will be similar to the following (assuming `exportedValues` as the given global name):

```javascript
(function() {
    "use strict";

	var foo$foo$$foo = 1;
	foo$foo$$default = foo$foo$$foo;

	var foo$foo$$bar = foo$foo$$foo + 1;

	this.exportedValues = this.exportedValues || {};
	this.exportedValues.foo = foo$foo$$foo;
	this.exportedValues.bar = foo$foo$$bar;
}).call(this);
```