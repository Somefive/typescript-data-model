export declare type I18NItem<T> = {
    [lang: string]: T;
} | T;
export declare type I18NString = I18NItem<string>;
export declare namespace I18N {
    let DefaultLang: string;
    function getString(i18nString: I18NString, lang?: string): string | undefined;
    function t(target: any, lang?: string): any;
}
