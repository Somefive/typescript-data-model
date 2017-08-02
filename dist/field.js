"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateFieldFilter(filter) {
    if (filter instanceof Array) {
        var generateFieldFilter_1 = {};
        filter.forEach(function (field) {
            var value = !field.startsWith("!");
            var fieldChain = field.startsWith("!") ? field.substr(1).split(".") : field.split(".");
            var currentDomain = generateFieldFilter_1;
            fieldChain.forEach(function (subField, index) {
                if (index === fieldChain.length - 1)
                    currentDomain[subField] = value;
                else {
                    if (!Reflect.has(currentDomain, subField))
                        currentDomain[subField] = {};
                    else if (typeof (currentDomain[subField]) !== "boolean")
                        currentDomain = currentDomain[subField];
                }
            });
        });
        return generateFieldFilter_1;
    }
    else
        return filter;
}
exports.generateFieldFilter = generateFieldFilter;
function getSubFieldFilter(parentFilter, subField) {
    return typeof (parentFilter[subField]) !== "boolean" ? parentFilter[subField] : undefined;
}
exports.getSubFieldFilter = getSubFieldFilter;
//# sourceMappingURL=field.js.map