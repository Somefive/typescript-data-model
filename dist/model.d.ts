import 'reflect-metadata';
import { ScenarioName } from './scenario';
import { IValidator, ValidationError } from './validator';
import { I18NString } from './i18n';
import { FieldFilter, ExtendFieldFilter } from './field';
export declare class Model {
    static readonly className: string;
    static readonly kebabClassName: string;
    static DefaultScenario: symbol;
    fields(fields?: string[]): string[];
    fieldName(field: string, lang?: string): string;
    fieldNames(fields?: string[], lang?: string): {
        [attr: string]: string;
    };
    fieldFilters(fields?: ExtendFieldFilter): FieldFilter;
    readonly fieldNamesLangPack: {
        [field: string]: I18NString;
    };
    scenario: ScenarioName;
    scenarioDefaultIncluded: boolean;
    constructor(obj?: Object);
    isFieldAvailable(field: string, checkScenario?: boolean): boolean;
    load(obj: Object, fields?: ExtendFieldFilter): void;
    protected toDocValue(value: any, field: string, fieldFilters: FieldFilter, force?: boolean, ignoreNil?: boolean): any;
    toDocs(fields?: ExtendFieldFilter, force?: boolean, ignoreNil?: boolean): Object;
    validate(fields?: ExtendFieldFilter, defaultValidator?: IValidator, force?: boolean): ValidationError;
}
