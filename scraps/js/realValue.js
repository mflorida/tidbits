/**
 * Return 'real' value represented by a string,
 * as proper type (TypeScript's worst nightmare)
 *
 * - returns real boolean for boolean string
 * - returns real number for numeric string
 * - returns null for 'null' string
 * - returns `undef` arg for undefined values
 *   (no `undef` argument returns undefined)
 *
 * could be useful for getting 'real' values from a
 * source that only uses strings (like <input> elements)
 *
 * @param {string} val - string representation of value
 * @param {*} [undef] - optional value to return for 'undefined'
 * @returns {*}
 */
export function realValue(val, undef){

    // only evaluate strings
    if (!isString(val)) return val;

    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'null') return null;
    if (val === 'undefined') return undef;
    if (isNumeric(val)) return Number(val);
    if (val === 'NaN') return NaN;  // is this needed?

    // last check is for possible JSON data
    // otherwise returns the original value
    return possiblyJSON(val) || val;

}

function isString(val){
    return typeof val === 'string';
}

function isNumeric(val){
    return (val - parseFloat(val) + 1) >= 0;
}

function safeParseJSON(data, fallback){
    let parsed;
    try {
        parsed = JSON.parse(data);
    }
    catch (e) {
        console.warn(e);
    }
    return parsed || (
      fallback !== undefined ? fallback : null
    );
}

function probablyJSON(it){
    return isString(it) && /^[{\[]/.test(it.trim());
}

function possiblyJSON(it){
    return (it && probablyJSON(it)) ? safeParseJSON(it) : it;
}
