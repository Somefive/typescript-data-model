"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var I18N;
(function (I18N) {
    I18N.DefaultLang = "en";
    function getString(i18nString, lang) {
        if (typeof (i18nString) === "string")
            return i18nString;
        else
            return i18nString[lang || I18N.DefaultLang];
    }
    I18N.getString = getString;
    function t(target, lang) {
        lang = lang || I18N.DefaultLang;
        if (target instanceof Array) {
            return target.map(function (item) { return t(item, lang); });
        }
        else if (typeof (target) === "object") {
            if (Reflect.has(target, lang))
                return target[lang];
            else {
                var tResult_1 = {};
                Object.keys(target).forEach(function (field) { return tResult_1[field] = t(target[field], lang); });
                return tResult_1;
            }
        }
        else
            return target;
    }
    I18N.t = t;
})(I18N = exports.I18N || (exports.I18N = {}));
//# sourceMappingURL=i18n.js.map