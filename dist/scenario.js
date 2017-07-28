"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.ScenarioMetadataKey = Symbol("data-model:scenario");
/**
 * ScenarioFilter is used with scenario to apply scenario on Class Object Properties.
 * In data model usage, while trying to validate a data model or publish a data model to docs, the scenario filter on
 * a property can help decide whether this property should be checked in validation or contained in a published doc.
 */
var ScenarioFilter = (function () {
    function ScenarioFilter(defaultIncluded, include, exclude) {
        if (defaultIncluded === void 0) { defaultIncluded = true; }
        if (include === void 0) { include = []; }
        if (exclude === void 0) { exclude = []; }
        this.include = include;
        this.exclude = exclude;
        this.defaultIncluded = defaultIncluded;
    }
    ScenarioFilter.prototype.check = function (scenario) {
        if (this.include.indexOf(scenario) >= 0)
            return true;
        if (this.exclude.indexOf(scenario) >= 0)
            return false;
        return this.defaultIncluded;
    };
    ScenarioFilter.NEVER = new ScenarioFilter(false);
    ScenarioFilter.ALWAYS = new ScenarioFilter(true);
    return ScenarioFilter;
}());
exports.ScenarioFilter = ScenarioFilter;
function scenario(scenarioFilter) {
    return Reflect.metadata(exports.ScenarioMetadataKey, scenarioFilter);
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