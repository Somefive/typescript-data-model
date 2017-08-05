import 'reflect-metadata';
import { Model } from './model';
import { ExtendFieldFilter } from './field';
export declare const LoaderMetadataKey: symbol;
export interface Factory<T = any> {
    new (...args: any[]): T;
}
export declare function loader(constructor: Factory, isModel?: boolean): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function load(target: Model, obj: Object, fields?: ExtendFieldFilter): void;
