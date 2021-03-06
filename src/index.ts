import { JSONSchema, JSONSchemaObject } from "@json-schema-tools/meta-schema";
import traverse from "@json-schema-tools/traverse";
import StringValidator, { StringValidationError } from "./base-validators/string";
import BooleanValidator, { BooleanValidationError } from "./base-validators/boolean";

// import all the different validation errors
type ValidationError = StringValidationError | BooleanValidationError;

export class ValidationErrors implements Error {
  public name = "ValidationErrors";
  public message: string;

  constructor(public errors: ValidationError[]) {
    this.message = "";
  }
}

/**
 * A validator is a function is passed a schema and some data to validate against the it.
 * Errors if your schema contains $refs. Use the json-schema-tools/dereferencer beforehand.
 * Circular references are handled.
 *
 * @param schema the schema to validate against
 * @param data the data to apply the schema to
 *
 */
const validator = (schema: JSONSchema, data: any): true | ValidationErrors => {
  const errors: ValidationError[] = [];

  if (typeof schema === "boolean") {
    const valid = BooleanValidator(schema, data);
    if (valid !== true) {
      errors.push(valid);
    }
  } else if (schema.type === "string") {
    const valid = StringValidator(schema, data);
    if (valid !== true) {
      errors.push(valid);
    }
  }

  if (errors.length === 0) {
    return true;
  }

  return new ValidationErrors(errors);
};

export default validator;
