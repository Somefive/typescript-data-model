import 'reflect-metadata';
import { IValidator, ValidationError } from './validator';
export declare class Model {
    scenario: string;
    scenarioDefaultInclude: boolean;
    constructor();
    isFieldAvailable(field: string): boolean;
    load(obj: Object, fields?: string[]): void;
    toDocs(fields?: string[]): Object;
    validate(fields?: string[], defaultValidator?: IValidator): ValidationError;
}
