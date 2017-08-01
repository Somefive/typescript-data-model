import 'reflect-metadata';
import { ScenarioName } from './scenario';
import { IValidator, ValidationError } from './validator';
export declare class Model {
    static readonly className: string;
    static readonly kebabClassName: string;
    static DefaultScenario: symbol;
    scenario: ScenarioName;
    scenarioDefaultIncluded: boolean;
    constructor();
    isFieldAvailable(field: string, checkScenario?: boolean): boolean;
    load(obj: Object, fields?: string[]): void;
    toDocs(fields?: string[], force?: boolean, ignoreNil?: boolean): Object;
    validate(fields?: string[], defaultValidator?: IValidator, force?: boolean): ValidationError;
}
