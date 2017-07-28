import 'reflect-metadata'

export const ScenarioMetadataKey = Symbol("mongo-model:scenario")

export class ScenarioFilter {
    defaultInclude: boolean
    include: string[]
    exclude: string[]
    constructor(defaultInclude = true, include: string[] = [], exclude: string[] = []) {
        this.include = include
        this.exclude = exclude
        this.defaultInclude = defaultInclude
    }
    check(scenario: string): boolean {
        if (this.include.indexOf(scenario) >= 0) 
            return true
        if (this.exclude.indexOf(scenario) >= 0) 
            return false
        return this.defaultInclude
    }
    static NEVER = new ScenarioFilter(false)
    static ALWAYS = new ScenarioFilter(true)
}

export function scenario(ScenarioFilter: ScenarioFilter) {
    return Reflect.metadata(ScenarioMetadataKey, ScenarioFilter)
}

export function Never() {
    return scenario(ScenarioFilter.NEVER)
}

export function Always() {
    return scenario(ScenarioFilter.ALWAYS)
}