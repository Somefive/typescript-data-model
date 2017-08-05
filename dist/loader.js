"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var lodash_1 = require("lodash");
var model_1 = require("./model");
var field_1 = require("./field");
exports.LoaderMetadataKey = Symbol("data-model:loader");
function loader(constructor, isModel) {
    if (isModel === void 0) { isModel = true; }
    return Reflect.metadata(exports.LoaderMetadataKey, [constructor, isModel]);
}
exports.loader = loader;
function factory(parentFilter, subField, value, constructor, isModel) {
    if (!constructor)
        return value;
    else if (!isModel)
        return new constructor(value);
    var _item = new constructor();
    _item.load(value, field_1.getSubFieldFilter(parentFilter, subField));
    return _item;
}
function load(target, obj, fields) {
    var fieldFilters = target.fieldFilters(fields);
    Object.keys(obj).forEach(function (field) {
        var newValue = Reflect.get(obj, field);
        if (fieldFilters[field] && target.isFieldAvailable(field) && !lodash_1.isNil(newValue)) {
            var oldValue = Reflect.get(target, field);
            var _factory = Reflect.getMetadata(exports.LoaderMetadataKey, target, field);
            var _a = _factory ? _factory : [undefined, undefined], constructor_1 = _a[0], isModel_1 = _a[1];
            if (oldValue instanceof model_1.Model)
                oldValue.load(newValue, field_1.getSubFieldFilter(fieldFilters, field));
            else if (oldValue instanceof Array && newValue instanceof Array) {
                oldValue.splice.apply(oldValue, [0, oldValue.length].concat(newValue.map(function (item) {
                    return factory(fieldFilters, field, item, constructor_1, isModel_1);
                })));
            }
            else
                Reflect.set(target, field, factory(fieldFilters, field, newValue, constructor_1, isModel_1));
        }
    });
}
exports.load = load;
//# sourceMappingURL=loader.js.map