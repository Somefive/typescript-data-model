import * as _ from 'lodash'
import 'reflect-metadata'
import {scenario, ScenarioFilter, ScenarioMetadataKey, Never, Always, ScenarioName} from './scenario'
import {ValidateMetadataKey, IValidator, ValidationError} from './validator'
import { I18NString, I18N } from './i18n'
import { FieldFilter, ExtendFieldFilter, generateFieldFilter, getSubFieldFilter } from './field'

export class Model {

    static get className(): string {
        return this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
    }

    static get kebabClassName(): string {
        return _.kebabCase(this.className)
    }

    static DefaultScenario = Symbol('default')

    fields(fields?: string[]): string[] {
        return fields || Object.getOwnPropertyNames(this)
    }

    fieldName(field: string, lang?: string): string {
        return I18N.getString(this.fieldNamesLangPack[field] || field, lang) || field
    }

    fieldNames(fields?: string[], lang?: string): {[attr: string]: string} {
        const fieldNames: {[attr: string]: string} = {}
        this.fields(fields).forEach(field => {
            if (this.isFieldAvailable(field))
                fieldNames[field] = this.fieldName(field, lang)
        })
        return fieldNames
    }

    fieldFilters(fields?: ExtendFieldFilter): FieldFilter {
        if (!fields) fields = this.fields()
        return generateFieldFilter(fields)
    }

    get fieldNamesLangPack(): {[field: string]: I18NString} {
        return {}
    }

    @Never()
    scenario: ScenarioName = Model.DefaultScenario

    @Never()
    scenarioDefaultIncluded: boolean = true
    
    constructor() {
    }

    isFieldAvailable(field: string, checkScenario=true): boolean {
        if (!Reflect.has(this, field))
            return false
        if (!checkScenario) return true
        const scenarioFilter = Reflect.getMetadata(ScenarioMetadataKey, this, field) as ScenarioFilter
        return scenarioFilter ? scenarioFilter.check(this.scenario) : this.scenarioDefaultIncluded
    }

    load(obj: Object, fields?: ExtendFieldFilter) {
        const fieldFilters = this.fieldFilters(fields)
        Object.keys(obj).forEach(field => {
            const value = Reflect.get(obj, field)
            if (fieldFilters[field] && this.isFieldAvailable(field) && !_.isNil(value)) {
                const oldValue = Reflect.get(this, field)
                if (oldValue instanceof Model)
                    oldValue.load(value, getSubFieldFilter(fieldFilters, field))
                else
                    Reflect.set(this, field, value)
            }
        })
    }

    protected toDocValue(value: any, field: string, fieldFilters: FieldFilter, force=false, ignoreNil=true): any {
        if (value instanceof Model) 
            return value.toDocs(getSubFieldFilter(fieldFilters, field), force, ignoreNil)
        else if (value instanceof Array) {
            return value.map(item => this.toDocValue(item, field, fieldFilters, force, ignoreNil))
        } else {
            return value
        }
    }

    toDocs(fields?: ExtendFieldFilter, force=false, ignoreNil=true): Object {
        const fieldFilters = this.fieldFilters(fields)
        const docs: any = {}
        Object.keys(this).forEach(field => {
            const value = Reflect.get(this, field)
            if ((!_.isNil(value) || !ignoreNil) && this.isFieldAvailable(field, !force) && fieldFilters[field])
                Reflect.set(docs, field, this.toDocValue(value, field, fieldFilters, force, ignoreNil))
        })
        return docs
    }

    validate(fields?: ExtendFieldFilter, defaultValidator?: IValidator, force=false): ValidationError {
        const fieldFilters = this.fieldFilters(fields)
        const errors: any = {}
        Object.keys(this).forEach(field => {
            if (fieldFilters[field] && this.isFieldAvailable(field, !force)) {
                const value = Reflect.get(this, field)
                const validator = defaultValidator || Reflect.getMetadata(ValidateMetadataKey, this, field) as IValidator
                if (validator) {
                    const error = validator.validate(value)
                    if (error)
                        errors[field] = error
                }
            }
        })
        return errors
    }
}