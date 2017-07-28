import 'reflect-metadata';
export declare const ScenarioMetadataKey: symbol;
/**
 * ScenarioFilter is used with scenario to apply scenario on Class Object Properties.
 * In data model usage, while trying to validate a data model or publish a data model to docs, the scenario filter on
 * a property can help decide whether this property should be checked in validation or contained in a published doc.
 */
export declare class ScenarioFilter {
    /**
     * if current scenario is neither included nor excluded, this will decide the policy.
     */
    defaultIncluded: boolean;
    /**
     * scenarios that this property should be included
     */
    include: string[];
    /**
     * scenarios that this property should be excluded
     */
    exclude: string[];
    constructor(defaultIncluded?: boolean, include?: string[], exclude?: string[]);
    check(scenario: string): boolean;
    static NEVER: ScenarioFilter;
    static ALWAYS: ScenarioFilter;
}
export declare function scenario(scenarioFilter: ScenarioFilter): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function Never(): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function Always(): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
