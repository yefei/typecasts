export class RequiredError extends Error {
  field?: string;

  constructor(field?: string) {
    super(`The field '${field || 'unknown'}' is required`);
    this.name = 'RequiredError';
    this.field = field;
  }
}

export class ValidateError extends Error {
  field: string;
  value: any;
  validate: string;
  target: any;
  constructor(field:string, validate:string, value:any, target:any) {
    super(`The field '${field}' value: ${value} must be ${validate} ${target}`);
    this.name = 'ValidateError';
    this.field = field;
    this.value = value;
    this.validate = validate;
    this.target = target;
  }
}
