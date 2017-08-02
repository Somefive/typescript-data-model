export declare type FieldFilter = {
    [field: string]: boolean | FieldFilter;
};
export declare type ExtendFieldFilter = FieldFilter | string[];
export declare function generateFieldFilter(filter: ExtendFieldFilter): FieldFilter;
export declare function getSubFieldFilter(parentFilter: FieldFilter, subField: string): FieldFilter | undefined;
