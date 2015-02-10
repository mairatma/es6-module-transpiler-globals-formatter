var assert = require('assert');
var fs = require('fs');
var GlobalsFormatter = require('../index');
var path = require('path');
var tmp = require('tmp');
var transpiler = require('es6-module-transpiler');

module.exports = {
	testGlobalAssignment: function(test) {
		var container = new transpiler.Container({
  			resolvers: [new transpiler.FileResolver(['test/fixtures/'])],
			formatter: new GlobalsFormatter({globalName: 'myGlobal'})
		});
		container.getModule('foo');
		container.getModule('bar');

		tmp.dir(function(err, tmpPath) {
			var bundleFilePath = path.join(tmpPath, 'bundle.js');
			container.write(bundleFilePath);

			assert.ok(!global.myGlobal);
			eval(fs.readFileSync(bundleFilePath, 'utf8'));

			assert.ok(global.myGlobal);
			assert.strictEqual(1, myGlobal.foo);
			assert.strictEqual(2, myGlobal.bar);

			test.done();
		});
	},

	testGlobalReuse: function(test) {
		var container = new transpiler.Container({
  			resolvers: [new transpiler.FileResolver(['test/fixtures/'])],
			formatter: new GlobalsFormatter({globalName: 'myGlobal'})
		});
		container.getModule('foo');
		container.getModule('bar');

		tmp.dir(function(err, tmpPath) {
			var bundleFilePath = path.join(tmpPath, 'bundle.js');
			container.write(bundleFilePath);

			global.myGlobal = {other: 3};
			eval(fs.readFileSync(bundleFilePath, 'utf8'));

			assert.strictEqual(1, myGlobal.foo);
			assert.strictEqual(2, myGlobal.bar);
			assert.strictEqual(3, myGlobal.other);

			test.done();
		});
	}
};