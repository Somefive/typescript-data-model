import * as _ from 'lodash'
import 'reflect-metadata'
import {scenario, ScenarioFilter, ScenarioMetadataKey, Never, Always, ScenarioName} from './scenario'
import {ValidateMetadataKey, IValidator, ValidationError} from './validator'

export class Model {

    static get className(): string {
        return this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];
    }

    static get kebabClassName(): string {
        return _.kebabCase(this.className)
    }

    static DefaultScenario = Symbol('default')

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

    load(obj: Object, fields?: string[]) {
        if (!fields)
            fields = Object.getOwnPropertyNames(obj)
        fields.forEach(field => {
            const value = Reflect.get(obj, field)
            if (!_.isNil(value) && this.isFieldAvailable(field)) {
                const oldValue = Reflect.get(this, field)
                if (oldValue instanceof Model)
                    oldValue.load(value)
                else
                    Reflect.set(this, field, value)
            }
        })
    }

    toDocs(fields?: string[], force=false, ignoreNil=true): Object {
        if (!fields)
            fields = Object.getOwnPropertyNames(this)
        const docs: any = {}
        fields.forEach(field => {
            const value = Reflect.get(this, field)
            if ((!_.isNil(value) || !ignoreNil) && this.isFieldAvailable(field, !force))
                Reflect.set(docs, field, (value instanceof Model) ? value.toDocs() : value)
        })
        return docs
    }

    validate(fields?: string[], defaultValidator?: IValidator, force=false): ValidationError {
        const errors: any = {}
        if (!fields)
            fields = Object.getOwnPropertyNames(this)
        fields.forEach(field => {
            if (this.isFieldAvailable(field, !force)) {
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