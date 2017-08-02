export type FieldFilter = {[field: string]: boolean|FieldFilter} 
export type ExtendFieldFilter = FieldFilter|string[]
export function generateFieldFilter(filter: ExtendFieldFilter): FieldFilter {
    if (filter instanceof Array) {
        const generateFieldFilter: FieldFilter = {}
        filter.forEach(field => {
            const value: boolean = !field.startsWith("!")
            const fieldChain = field.startsWith("!") ? field.substr(1).split(".") : field.split(".")
            let currentDomain: FieldFilter = generateFieldFilter
            fieldChain.forEach((subField, index) => {
                if (index === fieldChain.length - 1)
                    currentDomain[subField] = value
                else {
                    if (!Reflect.has(currentDomain, subField))
                        currentDomain[subField] = {}
                    else if (typeof(currentDomain[subField]) !== "boolean")
                        currentDomain = <FieldFilter>currentDomain[subField]
                }
            })
        })
        return generateFieldFilter
    } else
        return filter
}
export function getSubFieldFilter(parentFilter: FieldFilter, subField: string): FieldFilter | undefined {
    return typeof(parentFilter[subField]) !== "boolean" ? <FieldFilter>parentFilter[subField] : undefined
}