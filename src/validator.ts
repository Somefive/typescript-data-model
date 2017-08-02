import 'reflect-metadata'
import * as _ from 'lodash'
import { Model } from './model'
import { I18NString } from './i18n'
import { ExtendFieldFilter } from './field'

export const ValidateMetadataKey = Symbol("data-model:validator")
export function validate(...validators: IValidator[]) {
    if (validators.length > 1)
        return Reflect.metadata(ValidateMetadataKey, new ChainValidator(...validators))
    else
        return Reflect.metadata(ValidateMetadataKey, validators[0])
}
export type ValidationError = I18NString|undefined|{[attr:string]:ValidationError}
export interface IValidator {
    validate(obj: Object): ValidationError
}
export class RegexValidator implements IValidator {
    constructor(public regex: RegExp,
                public errorMessage: I18NString = "Invalid Format") {
    }
    validate(obj: Object): ValidationError {
        if (typeof(obj) === "string")
            return (this.regex.test(obj as string)) ? undefined : this.errorMessage
        else
            return undefined
    }
}
export class RangeValidator implements IValidator {
    constructor(public min: number = 0,
                public max: number = 1,
                public errorMessage: I18NString = "Out of range") {
    }
    validate(obj: Object): ValidationError {
        if (typeof(obj) !== "number") return undefined
        const _ = obj as number
        return (_ >= this.min && _ <= this.max) ? undefined : this.errorMessage
    }
}
export class ArrayValidator implements IValidator {
    constructor(public itemValidator: IValidator) {
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
    fields: ExtendFieldFilter | undefined
    constructor(fields?: ExtendFieldFilter) {
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
    constructor(public predicate: (obj: Object) => any,
                public errorMessage: I18NString = "Not Valid") {
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
    constructor(public errorMessage: I18NString = "Cannot be empty") {
    }
    validate(obj: Object): ValidationError {
        return _.isEmpty(obj) ? this.errorMessage : undefined
    }
}