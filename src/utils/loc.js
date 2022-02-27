function localizeString(lang, str, params) {
    str = lang[str];

    if (params) {
        for (const param in params) {
            if (str.includes(`R$${param}`)) {
                str = str.replace(`R$${param}`, `\u0060${params[param]}\u0060`);
            }

            if (str.includes(`Mr$${param}`)) {
                str = str.replace(`Mr$${param}`, `<@&${params[param]}>`);
            }

            if (str.includes(`Mc$${param}`)) {
                str = str.replace(`Mc$${param}`, `<#${params[param]}>`);
            }
        }
    }

    str = str.replaceAll("/$", "\u0060");

    return str;
}

module.exports = {
    localizeString,
};
