import 'reflect-metadata';
import { I18NString } from './i18n';
import { ExtendFieldFilter } from './field';
export declare const ValidateMetadataKey: symbol;
export declare function validate(...validators: IValidator[]): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare type ValidationError = I18NString | undefined | {
    [attr: string]: ValidationError;
};
export interface IValidator {
    validate(obj: Object): ValidationError;
}
export declare class RegexValidator implements IValidator {
    regex: RegExp;
    errorMessage: I18NString;
    constructor(regex: RegExp, errorMessage?: I18NString);
    validate(obj: Object): ValidationError;
}
export declare class RangeValidator implements IValidator {
    min: number;
    max: number;
    errorMessage: I18NString;
    constructor(min?: number, max?: number, errorMessage?: I18NString);
    validate(obj: Object): ValidationError;
}
export declare class ArrayValidator implements IValidator {
    itemValidator: IValidator;
    constructor(itemValidator: IValidator);
    validate(obj: Object): ValidationError;
}
export declare class NestedValidator implements IValidator {
    fields: ExtendFieldFilter | undefined;
    constructor(fields?: ExtendFieldFilter);
    validate(obj: Object): ValidationError;
}
export declare class ChainValidator implements IValidator {
    validators: IValidator[];
    constructor(...validators: IValidator[]);
    validate(obj: Object): ValidationError;
}
export declare class PredicateValidator implements IValidator {
    predicate: (obj: Object) => any;
    errorMessage: I18NString;
    constructor(predicate: (obj: Object) => any, errorMessage?: I18NString);
    validate(obj: Object): ValidationError;
}
export declare class NotEmptyValidator implements IValidator {
    errorMessage: I18NString;
    constructor(errorMessage?: I18NString);
    validate(obj: Object): ValidationError;
}
