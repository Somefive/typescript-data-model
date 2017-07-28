import { Db, Collection, CollectionInsertOneOptions, ReplaceOneOptions, ObjectID } from 'mongodb'
import * as _ from 'lodash'
import 'reflect-metadata'
import {scenario, ScenarioFilter, ScenarioMetadataKey, Never, Always} from './scenario'
import {ValidateMetadataKey, IValidator, ValidationError} from './validator'

export class Model {

    @Never()
    scenario: string = 'default'

    @Never()
    scenarioDefaultInclude: boolean = true
    
    constructor() {
    }

    isFieldAvailable(field: string): boolean {
        if (!Reflect.has(this, field))
            return false
        const scenarioFilter = Reflect.getMetadata(ScenarioMetadataKey, this, field) as ScenarioFilter
        return scenarioFilter ? scenarioFilter.check(this.scenario) : this.scenarioDefaultInclude
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

    toDocs(fields?: string[]): Object {
        if (!fields)
            fields = Object.getOwnPropertyNames(this)
        const docs: any = {}
        fields.forEach(field => {
            const value = Reflect.get(this, field)
            if (!_.isNil(value) && this.isFieldAvailable(field))
                Reflect.set(docs, field, (value instanceof Model) ? value.toDocs() : value)
        })
        return docs
    }

    validate(fields?: string[], defaultValidator?: IValidator): ValidationError {
        const errors: any = {}
        if (!fields)
            fields = Object.getOwnPropertyNames(this)
        fields.forEach(field => {
            const value = Reflect.get(this, field)
            const validator = defaultValidator || Reflect.getMetadata(ValidateMetadataKey, this, field) as IValidator
            if (validator) {
                const error = validator.validate(value)
                if (error)
                    errors[field] = error
            }
        })
        return errors
    }
}