export type I18NItem<T> = { [lang: string]: T } | T
export type I18NString = I18NItem<string>
export namespace I18N {
    export let DefaultLang = "en"
    export function getString(i18nString: I18NString, lang?: string): string | undefined {
        if (typeof(i18nString) === "string") return i18nString
        else return i18nString[lang || DefaultLang]
    }
    export function t(target: any, lang?: string): any {
        lang = lang || DefaultLang
        if (target instanceof Array) {
            return target.map(item => t(item, lang))
        } else if (typeof(target) === "object") {
            if (Reflect.has(target, lang)) return target[lang]
            else {
                const tResult: any = {}
                Object.keys(target).forEach(field => tResult[field] = t(target[field], lang))
                return tResult
            }
        } else
            return target
    }
}