import 'reflect-metadata';
import { IValidator, ValidationError } from './validator';
export declare class Model {
    static readonly className: string;
    static readonly kebabClassName: string;
    static DefaultScenario: string;
    scenario: string;
    scenarioDefaultIncluded: boolean;
    constructor();
    isFieldAvailable(field: string): boolean;
    load(obj: Object, fields?: string[]): void;
    toDocs(fields?: string[]): Object;
    validate(fields?: string[], defaultValidator?: IValidator): ValidationError;
}
