import 'reflect-metadata'

export const ScenarioMetadataKey = Symbol("data-model:scenario")

export type ScenarioName = string | symbol

/**
 * ScenarioFilter is used with scenario to apply scenario on Class Object Properties.
 * In data model usage, while trying to validate a data model or publish a data model to docs, the scenario filter on
 * a property can help decide whether this property should be checked in validation or contained in a published doc.
 */
export class ScenarioFilter {
    /**
     * if current scenario is neither included nor excluded, this will decide the policy.
     */
    defaultIncluded: boolean
    /**
     * scenarios that this property should be included
     */
    include: ScenarioName[]
    /**
     * scenarios that this property should be excluded
     */
    exclude: ScenarioName[]
    constructor(defaultIncluded = true, include: ScenarioName[] = [], exclude: ScenarioName[] = []) {
        this.include = include
        this.exclude = exclude
        this.defaultIncluded = defaultIncluded
    }
    check(scenario: ScenarioName): boolean {
        if (this.include.indexOf(scenario) >= 0) 
            return true
        if (this.exclude.indexOf(scenario) >= 0) 
            return false
        return this.defaultIncluded
    }
    static NEVER = new ScenarioFilter(false)
    static ALWAYS = new ScenarioFilter(true)
}

export function scenario(scenarioFilter: ScenarioFilter) {
    return Reflect.metadata(ScenarioMetadataKey, scenarioFilter)
}

export function Never() {
    return scenario(ScenarioFilter.NEVER)
}

export function Always() {
    return scenario(ScenarioFilter.ALWAYS)
}