"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var model_1 = require("./model");
var _ = require("lodash");
exports.ValidateMetadataKey = Symbol("data-model:validator");
function validate() {
    var validators = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        validators[_i] = arguments[_i];
    }
    if (validators.length > 1)
        return Reflect.metadata(exports.ValidateMetadataKey, new (ChainValidator.bind.apply(ChainValidator, [void 0].concat(validators)))());
    else
        return Reflect.metadata(exports.ValidateMetadataKey, validators[0]);
}
exports.validate = validate;
var RegexValidator = (function () {
    function RegexValidator(regex, errorMessage) {
        if (errorMessage === void 0) { errorMessage = "Invalid Format"; }
        this.regex = regex;
        this.errorMessage = errorMessage;
    }
    RegexValidator.prototype.validate = function (obj) {
        if (typeof (obj) === "string")
            return (this.regex.test(obj)) ? undefined : this.errorMessage;
        else
            return undefined;
    };
    return RegexValidator;
}());
exports.RegexValidator = RegexValidator;
var RangeValidator = (function () {
    function RangeValidator(min, max, errorMessage) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        if (errorMessage === void 0) { errorMessage = "Out of range"; }
        this.min = min;
        this.max = max;
        this.errorMessage = errorMessage;
    }
    RangeValidator.prototype.validate = function (obj) {
        if (typeof (obj) !== "number")
            return undefined;
        var _ = obj;
        return (_ >= this.min && _ <= this.max) ? undefined : this.errorMessage;
    };
    return RangeValidator;
}());
exports.RangeValidator = RangeValidator;
var ArrayValidator = (function () {
    function ArrayValidator(itemValidator) {
        this.itemValidator = itemValidator;
    }
    ArrayValidator.prototype.validate = function (obj) {
        var _this = this;
        var errors = {};
        if (obj instanceof Array) {
            obj.forEach(function (item, index) {
                var error = _this.itemValidator.validate(item);
                if (error)
                    errors[index] = error;
            });
        }
        return (Object.keys(errors).length == 0) ? undefined : errors;
    };
    return ArrayValidator;
}());
exports.ArrayValidator = ArrayValidator;
var NestedValidator = (function () {
    function NestedValidator() {
        var fields = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fields[_i] = arguments[_i];
        }
        this.fields = fields;
    }
    NestedValidator.prototype.validate = function (obj) {
        var validateResult = (obj instanceof model_1.Model) ? obj.validate(this.fields) : undefined;
        return (_.isEmpty(validateResult)) ? undefined : validateResult;
    };
    return NestedValidator;
}());
exports.NestedValidator = NestedValidator;
var ChainValidator = (function () {
    function ChainValidator() {
        var validators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            validators[_i] = arguments[_i];
        }
        this.validators = validators;
    }
    ChainValidator.prototype.validate = function (obj) {
        for (var _i = 0, _a = this.validators; _i < _a.length; _i++) {
            var validator = _a[_i];
            var error = validator.validate(obj);
            if (error)
                return error;
        }
        return undefined;
    };
    return ChainValidator;
}());
exports.ChainValidator = ChainValidator;
var PredicateValidator = (function () {
    function PredicateValidator(predicate, errorMessage) {
        if (errorMessage === void 0) { errorMessage = "Not Valid"; }
        this.predicate = predicate;
        this.errorMessage = errorMessage;
    }
    PredicateValidator.prototype.validate = function (obj) {
        var result = this.predicate(obj);
        if (typeof (result) === "boolean")
            return result ? undefined : this.errorMessage;
        else
            return result;
    };
    return PredicateValidator;
}());
exports.PredicateValidator = PredicateValidator;
var NotEmptyValidator = (function () {
    function NotEmptyValidator(errorMessage) {
        if (errorMessage === void 0) { errorMessage = "Cannot be empty"; }
        this.errorMessage = errorMessage;
    }
    NotEmptyValidator.prototype.validate = function (obj) {
        return _.isEmpty(obj) ? this.errorMessage : undefined;
    };
    return NotEmptyValidator;
}());
exports.NotEmptyValidator = NotEmptyValidator;
