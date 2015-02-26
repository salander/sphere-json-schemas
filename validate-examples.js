var fs = require('fs');
var Validator = require('jsonschema').Validator;
var val = new Validator();
var currentDir = __dirname;

// add types to validator
var typeNames = fs.readdirSync(currentDir + '/schema/types');
for (var i = 0; i < typeNames.length; i++) {
  var typeFileName = currentDir + '/schema/types/' + typeNames[i];
  console.log('Reading type: ' + typeFileName);
  var type = require('' + typeFileName);
  val.addSchema(type)
}

var referenceFileName = currentDir + '/schema/types/reference.json';
var reference = require('' + referenceFileName);
val.addSchema(reference)

var schemaNames = fs.readdirSync(currentDir + '/examples');

// TODO: add verbose / quiet options
for (var i = 0; i < schemaNames.length; i++) {
  schemaName = schemaNames[i];
  // read schema definition
  var schemaFileName = currentDir + '/schema/' + schemaName + '.schema.json';
  console.log('Reading schema: ' + schemaFileName);
  var schema = require('' + schemaFileName);

  // read examples related to current schema
  var targetDir = currentDir + '/examples/' + schemaName;
  var examples = fs.readdirSync(targetDir);
  if (!examples) {
    console.warn('No files found in directory: ' + targetDir);
  }
  for (var j = 0; j < examples.length; j++) {
    var exampleFileName = currentDir + '/examples/' + schemaName + '/' + examples[j];
    console.log('Reading example: ' + exampleFileName);
    var example = require('' + exampleFileName);

    // validate example against schema
    result = val.validate(example, schema);
    if (result.errors.length > 0) {
      console.error('Validation FAILED: ', result.errors);
      process.exit(1);
    } else {
      console.log('Ok');
    }
  }
}
