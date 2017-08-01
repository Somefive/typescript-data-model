import 'reflect-metadata';
export declare const ValidateMetadataKey: symbol;
export declare function validate(...validators: IValidator[]): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare type ValidationError = string | undefined | {
    [attr: string]: ValidationError;
};
export interface IValidator {
    validate(obj: Object): ValidationError;
}
export declare class RegexValidator implements IValidator {
    regex: RegExp;
    errorMessage: string;
    constructor(regex: RegExp, errorMessage?: string);
    validate(obj: Object): ValidationError;
}
export declare class RangeValidator implements IValidator {
    min: number;
    max: number;
    errorMessage: string;
    constructor(min?: number, max?: number, errorMessage?: string);
    validate(obj: Object): ValidationError;
}
export declare class ArrayValidator implements IValidator {
    itemValidator: IValidator;
    constructor(itemValidator: IValidator);
    validate(obj: Object): ValidationError;
}
export declare class NestedValidator implements IValidator {
    fields: string[];
    constructor(...fields: string[]);
    validate(obj: Object): ValidationError;
}
export declare class ChainValidator implements IValidator {
    validators: IValidator[];
    constructor(...validators: IValidator[]);
    validate(obj: Object): ValidationError;
}
export declare class PredicateValidator implements IValidator {
    predicate: (obj: Object) => any;
    errorMessage: string;
    constructor(predicate: (obj: Object) => any, errorMessage?: string);
    validate(obj: Object): ValidationError;
}
export declare class NotEmptyValidator implements IValidator {
    errorMessage: string;
    constructor(errorMessage?: string);
    validate(obj: Object): ValidationError;
}
