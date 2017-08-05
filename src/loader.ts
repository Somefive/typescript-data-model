import 'reflect-metadata'
import { isNil } from 'lodash'
import { Model } from './model'
import { ExtendFieldFilter, getSubFieldFilter, FieldFilter } from './field'

export const LoaderMetadataKey = Symbol("data-model:loader")

export interface Factory<T = any> {
    new(...args:any[]): T
}

export function loader(constructor: Factory, isModel: boolean=true) {
    return Reflect.metadata(LoaderMetadataKey, [constructor, isModel])
}

function factory(parentFilter: FieldFilter, subField: string, value: any, constructor?: Factory, isModel?: boolean): any {
    if (!constructor) return value
    else if (!isModel) return new constructor(value)
    let _item = new constructor() as Model
    _item.load(value, getSubFieldFilter(parentFilter, subField))
    return _item
}

export function load(target: Model, obj: Object, fields?: ExtendFieldFilter) {
    const fieldFilters = target.fieldFilters(fields)
    Object.keys(obj).forEach(field => {
        const newValue = Reflect.get(obj, field)
        if (fieldFilters[field] && target.isFieldAvailable(field) && !isNil(newValue)) {
            const oldValue = Reflect.get(target, field)
            const _factory = Reflect.getMetadata(LoaderMetadataKey, target, field)
            const [constructor, isModel] = _factory ? _factory as [Factory, boolean] : [undefined, undefined]
            if (oldValue instanceof Model)
                oldValue.load(newValue, getSubFieldFilter(fieldFilters, field))
            else if (oldValue instanceof Array && newValue instanceof Array) {
                oldValue.splice(0, oldValue.length, ...newValue.map(item => 
                    factory(fieldFilters, field, item, constructor, isModel)))
            } else
                Reflect.set(target, field, factory(fieldFilters, field, newValue, constructor, isModel))
        }
    })
}