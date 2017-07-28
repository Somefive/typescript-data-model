import 'reflect-metadata';
export declare const ScenarioMetadataKey: symbol;
/**
 *
 */
export declare class ScenarioFilter {
    defaultInclude: boolean;
    include: string[];
    exclude: string[];
    constructor(defaultInclude?: boolean, include?: string[], exclude?: string[]);
    check(scenario: string): boolean;
    static NEVER: ScenarioFilter;
    static ALWAYS: ScenarioFilter;
}
export declare function scenario(ScenarioFilter: ScenarioFilter): {
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
