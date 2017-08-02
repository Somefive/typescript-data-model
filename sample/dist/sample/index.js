"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var model_1 = require("../src/model");
var validator_1 = require("../src/validator");
var scenario_1 = require("../src/scenario");
var i18n_1 = require("../src/i18n");
var field_1 = require("../src/field");
/** You can create your own validator implements IValidator */
var MyValidator = (function () {
    function MyValidator(errorMessage) {
        if (errorMessage === void 0) { errorMessage = "my error message"; }
        this.errorMessage = errorMessage;
    }
    MyValidator.prototype.validate = function (obj) {
        return (obj.length > 15) ? this.errorMessage : undefined;
    };
    return MyValidator;
}());
/** A simple nested model. */
var Name = (function (_super) {
    __extends(Name, _super);
    function Name(firstName, lastName) {
        if (firstName === void 0) { firstName = ""; }
        if (lastName === void 0) { lastName = ""; }
        var _this = _super.call(this) || this;
        _this.firstName = firstName;
        _this.lastName = lastName;
        return _this;
    }
    Object.defineProperty(Name.prototype, "fullName", {
        get: function () {
            return this.lastName + " " + this.firstName;
        },
        enumerable: true,
        configurable: true
    });
    Name.prototype.toDocs = function (fields) {
        var parentResult = _super.prototype.toDocs.call(this, fields);
        return __assign({}, parentResult, { fullName: this.fullName });
    };
    __decorate([
        validator_1.validate(new validator_1.ChainValidator(new validator_1.NotEmptyValidator(), new validator_1.PredicateValidator(function (obj) { return obj.length <= 15; }))),
        __metadata("design:type", String)
    ], Name.prototype, "firstName", void 0);
    __decorate([
        validator_1.validate(new MyValidator()),
        __metadata("design:type", String)
    ], Name.prototype, "lastName", void 0);
    return Name;
}(model_1.Model));
var User = (function (_super) {
    __extends(User, _super);
    function User(name, age, contact) {
        if (name === void 0) { name = null; }
        if (age === void 0) { age = 18; }
        if (contact === void 0) { contact = []; }
        var _this = _super.call(this) || this;
        _this.fieldNamesLangPack = {
            password: {
                en: "user password",
                zh: "密码"
            }
        };
        _this.name = name || new Name();
        _this.age = age;
        _this.contact = contact;
        _this.password = "";
        return _this;
    }
    User.UserScenario = "user";
    __decorate([
        validator_1.validate(new validator_1.NestedValidator(["firstName", "lastName"])),
        __metadata("design:type", Name)
    ], User.prototype, "name", void 0);
    __decorate([
        validator_1.validate(new validator_1.RangeValidator(1, 100)),
        __metadata("design:type", Number)
    ], User.prototype, "age", void 0);
    __decorate([
        validator_1.validate(new validator_1.PredicateValidator(function (obj) { return obj.length > 0; }, "At least one contact."), new validator_1.ArrayValidator(new validator_1.RegexValidator(/[0-9]{6,15}/))),
        scenario_1.scenario(new scenario_1.ScenarioFilter(true, [], [User.UserScenario])),
        __metadata("design:type", Array)
    ], User.prototype, "contact", void 0);
    __decorate([
        validator_1.validate(new validator_1.NotEmptyValidator({ en: "Password cannot be empty.", zh: "密码不能为空" })),
        scenario_1.scenario(new scenario_1.ScenarioFilter(false, [User.UserScenario])),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    return User;
}(model_1.Model));
var user = new User();
/** load simple object data */
user.load({
    name: {
        firstName: "Snow",
        lastName: "John"
    },
    contact: ["123456789", "134"]
});
/** this gives a brief overview of the user object */
console.log("Full user:\n", user);
/** only contact['1'] validation failed */
console.log("Validation:\n", user.validate());
console.log("Publish Doc:\n", user.toDocs());
user.scenario = User.UserScenario;
/** contact is ignored and password is checked now */
console.log("Validation after change scenario:\n", i18n_1.I18N.t(user.validate(), "zh"));
user.password = "userpass";
/** now published doc does not have contact but has password */
console.log("Doc after change scenario\n", user.toDocs());
var i18NObject = {
    name: "John Snow",
    occupation: {
        en: "Nights Watch",
        zh: "守夜人"
    }
};
/** Try I18N translation */
console.log("I18N translation:", i18n_1.I18N.t(i18NObject, "zh"));
/** Try generate filter by generateFieldFilter */
var fieldsFilter = ["id", "profiles.id", "profiles.name", "!profiles.age"];
console.log("FieldFilter generate:", field_1.generateFieldFilter(fieldsFilter));
/** Try output field names */
console.log(user.fieldNames(undefined, "zh"));
