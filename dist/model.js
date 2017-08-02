"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
require("reflect-metadata");
var scenario_1 = require("./scenario");
var validator_1 = require("./validator");
var i18n_1 = require("./i18n");
var field_1 = require("./field");
var Model = (function () {
    function Model() {
        this.scenario = Model.DefaultScenario;
        this.scenarioDefaultIncluded = true;
    }
    Object.defineProperty(Model, "className", {
        get: function () {
            return this.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model, "kebabClassName", {
        get: function () {
            return _.kebabCase(this.className);
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.fields = function (fields) {
        return fields || Object.getOwnPropertyNames(this);
    };
    Model.prototype.fieldName = function (field, lang) {
        return i18n_1.I18N.getString(this.fieldNamesLangPack[field] || field, lang) || field;
    };
    Model.prototype.fieldNames = function (fields, lang) {
        var _this = this;
        var fieldNames = {};
        this.fields(fields).forEach(function (field) {
            if (_this.isFieldAvailable(field))
                fieldNames[field] = _this.fieldName(field, lang);
        });
        return fieldNames;
    };
    Model.prototype.fieldFilters = function (fields) {
        if (!fields)
            fields = this.fields();
        return field_1.generateFieldFilter(fields);
    };
    Object.defineProperty(Model.prototype, "fieldNamesLangPack", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.isFieldAvailable = function (field, checkScenario) {
        if (checkScenario === void 0) { checkScenario = true; }
        if (!Reflect.has(this, field))
            return false;
        if (!checkScenario)
            return true;
        var scenarioFilter = Reflect.getMetadata(scenario_1.ScenarioMetadataKey, this, field);
        return scenarioFilter ? scenarioFilter.check(this.scenario) : this.scenarioDefaultIncluded;
    };
    Model.prototype.load = function (obj, fields) {
        var _this = this;
        var fieldFilters = this.fieldFilters(fields);
        Object.keys(obj).forEach(function (field) {
            var value = Reflect.get(obj, field);
            if (fieldFilters[field] && _this.isFieldAvailable(field) && !_.isNil(value)) {
                var oldValue = Reflect.get(_this, field);
                if (oldValue instanceof Model)
                    oldValue.load(value, field_1.getSubFieldFilter(fieldFilters, field));
                else
                    Reflect.set(_this, field, value);
            }
        });
    };
    Model.prototype.toDocValue = function (value, field, fieldFilters, force, ignoreNil) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (ignoreNil === void 0) { ignoreNil = true; }
        if (value instanceof Model)
            return value.toDocs(field_1.getSubFieldFilter(fieldFilters, field), force, ignoreNil);
        else if (value instanceof Array) {
            return value.map(function (item) { return _this.toDocValue(item, field, fieldFilters, force, ignoreNil); });
        }
        else {
            return value;
        }
    };
    Model.prototype.toDocs = function (fields, force, ignoreNil) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (ignoreNil === void 0) { ignoreNil = true; }
        var fieldFilters = this.fieldFilters(fields);
        var docs = {};
        Object.keys(this).forEach(function (field) {
            var value = Reflect.get(_this, field);
            if ((!_.isNil(value) || !ignoreNil) && _this.isFieldAvailable(field, !force) && fieldFilters[field])
                Reflect.set(docs, field, _this.toDocValue(value, field, fieldFilters, force, ignoreNil));
        });
        return docs;
    };
    Model.prototype.validate = function (fields, defaultValidator, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        var fieldFilters = this.fieldFilters(fields);
        var errors = {};
        Object.keys(this).forEach(function (field) {
            if (fieldFilters[field] && _this.isFieldAvailable(field, !force)) {
                var value = Reflect.get(_this, field);
                var validator = defaultValidator || Reflect.getMetadata(validator_1.ValidateMetadataKey, _this, field);
                if (validator) {
                    var error = validator.validate(value);
                    if (error)
                        errors[field] = error;
                }
            }
        });
        return errors;
    };
    Model.DefaultScenario = Symbol('default');
    __decorate([
        scenario_1.Never(),
        __metadata("design:type", Object)
    ], Model.prototype, "scenario", void 0);
    __decorate([
        scenario_1.Never(),
        __metadata("design:type", Boolean)
    ], Model.prototype, "scenarioDefaultIncluded", void 0);
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map