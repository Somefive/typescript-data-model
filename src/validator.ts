import 'reflect-metadata'
import { Model } from './model'
import * as _ from 'lodash'
export const ValidateMetadataKey = Symbol("data-model:validator")
export function validate(...validators: IValidator[]) {
    if (validators.length > 1)
        return Reflect.metadata(ValidateMetadataKey, new ChainValidator(...validators))
    else
        return Reflect.metadata(ValidateMetadataKey, validators[0])
}
export type ValidationError = string|undefined|{[attr:string]:ValidationError}
export interface IValidator {
    validate(obj: Object): ValidationError
}
export class RegexValidator implements IValidator {
    regex: RegExp
    errorMessage: string
    constructor(regex: RegExp, errorMessage: string = "Invalid Format") {
        this.regex = regex
        this.errorMessage = errorMessage
    }
    validate(obj: Object): ValidationError {
        if (typeof(obj) === "string")
            return (this.regex.test(obj as string)) ? undefined : this.errorMessage
        else
            return undefined
    }
}
export class RangeValidator implements IValidator {
    min: number
    max: number
    errorMessage: string
    constructor(min: number = 0, max: number = 1, errorMessage: string = "Out of range") {
        this.min = min
        this.max = max
        this.errorMessage = errorMessage
    }
    validate(obj: Object): ValidationError {
        if (typeof(obj) !== "number") return undefined
        const _ = obj as number
        return (_ >= this.min && _ <= this.max) ? undefined : this.errorMessage
    }
}
export class ArrayValidator implements IValidator {
    itemValidator: IValidator
    constructor(itemValidator: IValidator) {
        this.itemValidator = itemValidator
    }
    validate(obj: Object): ValidationError {
        const errors: any = {}
        if (obj instanceof Array) {
            obj.forEach((item, index) => {
                const error = this.itemValidator.validate(item)
                if (error) errors[index] = error
            })
        }
        return (Object.keys(errors).length == 0) ? undefined : errors
    }
}
export class NestedValidator implements IValidator {
    fields: string[]
    constructor(...fields: string[]) {
        this.fields = fields
    }
    validate(obj: Object): ValidationError {
        const validateResult = (obj instanceof Model) ? obj.validate(this.fields) : undefined
        return (_.isEmpty(validateResult)) ? undefined : validateResult
    }
}
export class ChainValidator implements IValidator {
    validators: IValidator[]
    constructor(...validators: IValidator[]) {
        this.validators = validators
    }
    validate(obj: Object): ValidationError {
        for (let validator of this.validators) {
            const error = validator.validate(obj)
            if (error) 
                return error
        }
        return undefined
    }
}
export class PredicateValidator implements IValidator {
    predicate: (obj: Object) => any
    errorMessage: string
    constructor(predicate: (obj: Object) => any, errorMessage: string = "Not Valid") {
        this.predicate = predicate
        this.errorMessage = errorMessage
    }
    validate(obj: Object): ValidationError {
        const result = this.predicate(obj)
        if (typeof(result) === "boolean")
            return result ? undefined : this.errorMessage
        else
            return result
    }
}
export class NotEmptyValidator implements IValidator {
    errorMessage: string
    constructor(errorMessage: string = "Cannot be empty") {
        this.errorMessage = errorMessage
    }
    validate(obj: Object): ValidationError {
        return _.isEmpty(obj) ? this.errorMessage : undefined
    }
}