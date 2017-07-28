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
    Model.prototype.isFieldAvailable = function (field) {
        if (!Reflect.has(this, field))
            return false;
        var scenarioFilter = Reflect.getMetadata(scenario_1.ScenarioMetadataKey, this, field);
        return scenarioFilter ? scenarioFilter.check(this.scenario) : this.scenarioDefaultIncluded;
    };
    Model.prototype.load = function (obj, fields) {
        var _this = this;
        if (!fields)
            fields = Object.getOwnPropertyNames(obj);
        fields.forEach(function (field) {
            var value = Reflect.get(obj, field);
            if (!_.isNil(value) && _this.isFieldAvailable(field)) {
                var oldValue = Reflect.get(_this, field);
                if (oldValue instanceof Model)
                    oldValue.load(value);
                else
                    Reflect.set(_this, field, value);
            }
        });
    };
    Model.prototype.toDocs = function (fields) {
        var _this = this;
        if (!fields)
            fields = Object.getOwnPropertyNames(this);
        var docs = {};
        fields.forEach(function (field) {
            var value = Reflect.get(_this, field);
            if (!_.isNil(value) && _this.isFieldAvailable(field))
                Reflect.set(docs, field, (value instanceof Model) ? value.toDocs() : value);
        });
        return docs;
    };
    Model.prototype.validate = function (fields, defaultValidator) {
        var _this = this;
        var errors = {};
        if (!fields)
            fields = Object.getOwnPropertyNames(this);
        fields.forEach(function (field) {
            if (_this.isFieldAvailable(field)) {
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
    Model.DefaultScenario = 'default';
    __decorate([
        scenario_1.Never(),
        __metadata("design:type", String)
    ], Model.prototype, "scenario", void 0);
    __decorate([
        scenario_1.Never(),
        __metadata("design:type", Boolean)
    ], Model.prototype, "scenarioDefaultIncluded", void 0);
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map