import { doddle } from "doddle"

const tokens = {
    namespace: [
        "document",
        "window",
        "console",
        "Math",
        "JSON",
        "Reflect",
        "NetworkLog",
        "runtime",
        "Intl",
        "location",
        "history",
        "navigator",
        "screen",
        "performance",
        "Atomics"
    ],

    function: [
        "write",
        "Number",
        "String",
        "log",
        "error",
        "Boolean",
        "Symbol",
        "encodeURIComponent",
        "decodeURIComponent",
        "encodeURI",
        "decodeURI",
        "eval",
        "fetch",
        "setTimeout",
        "setInterval",
        "clearTimeout",
        "clearInterval",
        "setAttribute",
        "getAttribute",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "addEventListener",
        "removeEventListener",
        "querySelector",
        "querySelectorAll",
        "getElementById",
        "getElementsByClassName",
        "getElementsByTagName",
        "getElementsByName",
        "getElementsByTagNameNS",
        "createElement",
        "createElementNS",
        "createTextNode",
        "createComment",
        "createDocumentFragment",
        "createEvent",
        "createCustomEvent",
        "dispatchEvent",
        "getComputedStyle",
        "getBoundingClientRect",
        "getClientRects",
        "scrollTo",
        "scrollBy",
        "scrollIntoView",
        "alert",
        "confirm",
        "constructor"
    ],
    class: [
        "Error",
        "Object",
        "Array",
        "Element",
        "HTMLElement",
        "Node",
        "Event",
        "Date",
        "RegExp",
        "Promise"
    ],
    local: ["i_win"],
    special: ["Function", "arguments"],
    property: [
        "prototype",
        "length",
        "name",
        "arguments",
        "body",
        "caller",
        "callee",
        "size",
        "contentWindow",
        "contentDocument",
        "innerHTML",
        "outerHTML",
        "innerText",
        "outerText",
        "textContent",
        "children",
        "childNodes",
        "firstChild",
        "lastChild",
        "nextSibling",
        "previousSibling",
        "parentElement",
        "parentNode",
        "style",
        "classList",
        "className",
        "id",
        "tagName",
        "nodeName",
        "nodeType",
        "nodeValue"
    ]
} as const

export type TokenType = keyof typeof tokens

export default doddle(() => {
    const entries = Object.entries(tokens)
    const map = new Map<string, TokenType>()
    for (const [type, values] of entries) {
        for (const value of values) {
            map.set(value, type as TokenType)
        }
    }
    return (token: string) => {
        token = token.trim()
        let isDot = false
        if (token.startsWith(".")) {
            token = token.slice(1)
            isDot = true
        }
        const result = map.get(token)
        if (result) {
            return result
        }
        if (isDot) {
            return "property"
        }
    }
})
