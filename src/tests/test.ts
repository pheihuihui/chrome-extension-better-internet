import assert from "assert";
import { BlockingFilter, CombinedMatcher, Filter, RegExpFilter } from "../pac_im";
import { testRequests } from "./testRequests";
import { testRules } from "./testRules";
const pacjs = require('../pac.js')

let tsMatcher = new CombinedMatcher()
for (const rule of testRules) {
    tsMatcher.add(Filter.fromText(rule) as RegExpFilter)
}

let jsMatcher = pacjs.defaultMatcher_js as CombinedMatcher
let jsFilter = pacjs.Filter_js
let jsBlockingFilter = pacjs.BlockingFilter_js
for (const rule of testRules) {
    jsMatcher.add(jsFilter.fromText(rule))
}

type TResult = {
    URL: string
    ProxyType: 'direct' | 'proxy'
}

type TRequest = {
    URL: string
    Host: string
}

function ts_logProxyForUrls(url: string, host: string): TResult {
    if (tsMatcher.matchesAny(url, host) instanceof BlockingFilter) {
        return { URL: url, ProxyType: 'proxy' }
    } else {
        return { URL: url, ProxyType: 'direct' }
    }
}

function js_logProxyForUrls(url: string, host: string): TResult {
    if (jsMatcher.matchesAny(url, host) instanceof jsBlockingFilter) {
        return { URL: url, ProxyType: 'proxy' }
    } else {
        return { URL: url, ProxyType: 'direct' }
    }
}

testRequests.forEach(x => {
    it('tests', () => {
        let ts_res = ts_logProxyForUrls(x.URL, x.Host).ProxyType
        let js_res = js_logProxyForUrls(x.URL, x.Host).ProxyType
        assert.strictEqual(ts_res, js_res)
    })
})