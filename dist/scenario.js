"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.ScenarioMetadataKey = Symbol("mongo-model:scenario");
var ScenarioFilter = (function () {
    function ScenarioFilter(defaultInclude, include, exclude) {
        if (defaultInclude === void 0) { defaultInclude = true; }
        if (include === void 0) { include = []; }
        if (exclude === void 0) { exclude = []; }
        this.include = include;
        this.exclude = exclude;
        this.defaultInclude = defaultInclude;
    }
    ScenarioFilter.prototype.check = function (scenario) {
        if (this.include.indexOf(scenario) >= 0)
            return true;
        if (this.exclude.indexOf(scenario) >= 0)
            return false;
        return this.defaultInclude;
    };
    ScenarioFilter.NEVER = new ScenarioFilter(false);
    ScenarioFilter.ALWAYS = new ScenarioFilter(true);
    return ScenarioFilter;
}());
exports.ScenarioFilter = ScenarioFilter;
function scenario(ScenarioFilter) {
    return Reflect.metadata(exports.ScenarioMetadataKey, ScenarioFilter);
}
exports.scenario = scenario;
function Never() {
    return scenario(ScenarioFilter.NEVER);
}
exports.Never = Never;
function Always() {
    return scenario(ScenarioFilter.ALWAYS);
}
exports.Always = Always;
//# sourceMappingURL=scenario.js.map