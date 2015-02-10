var b = require('recast').types.builders;
var transpiler = require('es6-module-transpiler');
var utils = require('es6-module-transpiler/lib/utils');

var BundleFormatter = transpiler.formatters.bundle;

/**
 * Formatter that extends from BundleFormatter, but assigns all exported
 * variables from the formatted modules to a global at the end.
 * @constructor
 */
function GlobalsFormatter(config) {
  config = config || {};
  this.globalName_ = config.globalName;
}
utils.extend(GlobalsFormatter, BundleFormatter);

/**
 * Overrides the original build method from `BundleFormatter`, adding global
 * assignments for module exports at the bottom of the built program.
 * @param {Array} modules [description]
 * @return {Array}
 * @override
 */
GlobalsFormatter.prototype.build = function(modules) {
  var builtFiles = BundleFormatter.prototype.build.call(this, modules);
  var body = builtFiles[0].program.body[0].expression.callee.object.body.body;
  body.push.apply(body, this.buildGlobalAssignments(modules));
  return builtFiles;
};

/**
 * Assigns all exports from all modules to variables inside the requested
 * global object.
 * @param {!Array} modules
 * @return {Array}
 */
GlobalsFormatter.prototype.buildGlobalAssignments = function(modules) {
  var assignments = [],
    self = this;

  // this.{globalName} = this.{globalName} || {};
  assignments.push(b.expressionStatement(b.assignmentExpression(
    '=',
    b.identifier('this.' + self.globalName_),
    b.logicalExpression(
      '||',
      b.identifier('this.' + self.globalName_),
      b.objectExpression([])
    )
  )));

  modules.forEach(function(module) {
    module.exports.declarations.forEach(function(exportDeclaration) {
      exportDeclaration.specifiers.forEach(function(specifier) {
        // this.{globalName}.{exportName} = {localName};
        var exportName = specifier.name === 'default' ? specifier.node.name : specifier.name;
        assignments.push(b.expressionStatement(b.assignmentExpression(
          '=',
          b.identifier('this.' + self.globalName_ + '.' + exportName),
          self.reference(module, exportName)
        )));
      });
    });
  });

  return assignments;
};

module.exports = GlobalsFormatter;