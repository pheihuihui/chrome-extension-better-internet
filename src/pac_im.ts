import { ThreeSixtySharp } from "@material-ui/icons"

const typeMapKeys = ['OTHER', 'SCRIPT', 'IMAGE', 'STYLESHEET', 'OBJECT', 'SUBDOCUMENT', 'DOCUMENT', 'XBL', 'PING', 'XMLHTTPREQUEST', 'OBJECT_SUBREQUEST', 'DTD', 'MEDIA', 'FONT', 'BACKGROUND', 'POPUP', 'ELEMHIDE'] as const
type TTypeMapKeys = typeof typeMapKeys[number]
type Nullable<T> = T | null

const c_typeMap: Record<TTypeMapKeys, number> = {
    OTHER: 1,
    SCRIPT: 2,
    IMAGE: 4,
    STYLESHEET: 8,
    OBJECT: 16,
    SUBDOCUMENT: 32,
    DOCUMENT: 64,
    XBL: 1,
    PING: 1,
    XMLHTTPREQUEST: 2048,
    OBJECT_SUBREQUEST: 4096,
    DTD: 1,
    MEDIA: 16384,
    FONT: 32768,
    BACKGROUND: 4,
    POPUP: 268435456,
    ELEMHIDE: 1073741824
}

function getOwnPropertyDescriptor(obj: any, key: string) {
    if (obj.hasOwnProperty(key)) {
        return obj[key]
    }
    return null
}

function createDict() {
    return {}
}

export class Filter {
    constructor(txt: string) {
        this.text = txt
        this.subscriptions = []
    }

    "0": "#this"
    length = 1
    text: string | null = null
    subscriptions: string[] | null = null
    toString() {
        return this.text
    }

    static knownFilters = createDict() as Record<string, Filter>
    static elemhideRegExp = /^([^\/\*\|\@"!]*?)#(\@)?(?:([\w\-]+|\*)((?:\([\w\-]+(?:[$^*]?=[^\(\)"]*)?\))*)|#([^{}]+))$/
    static regexpRegExp = /^(@@)?\/.*\/(?:\$~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)?$/
    static optionsRegExp = /\$(~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)$/

    static fromText(txt: string) {
        if (txt in Filter.knownFilters) {
            return Filter.knownFilters[txt]
        }
        let ret: Filter
        if (txt.charAt(0) == '!') {
            return new CommentFilter(txt)
        } else {
            ret = RegExpFilter.fromText(txt)
        }
        if (ret.text) {
            Filter.knownFilters[ret.text] = ret
        }
        return ret
    }
}

class InvalidFilter extends Filter {
    constructor(txt: string, reason: string) {
        super(txt)
        this.reason = reason
    }

    reason: string | null = null
}

class CommentFilter extends Filter {
    constructor(txt: string) {
        super(txt)
    }
}

abstract class ActiveFilter extends Filter {
    constructor(txt: string, domains: string) {
        super(txt)
        this.domainSource = domains
    }

    domainSource: string | null = null
    domainSeparator: string = ""
    ignoreTrailingDot: boolean | null = true
    domainSourceIsUpperCase: boolean | null = false
    domains: Record<string, boolean> | null = null

    getDomains() {
        let prop = getOwnPropertyDescriptor(this, "domains")
        if (prop) {
            return prop as Record<string, boolean>
        }
        let domains: Record<string, boolean> | null = null
        if (this.domainSource) {
            let source = this.domainSource
            if (!this.domainSourceIsUpperCase) {
                source = source.toUpperCase()
            }
            let list = source.split(this.domainSeparator)
            if (list.length == 1 && (list[0]).charAt(0) != "~") {
                domains = createDict()
                domains[""] = false
                if (this.ignoreTrailingDot) {
                    list[0] = list[0].replace(/\.+$/, "")
                }
                domains[list[0]] = true
            }
            else {
                let hasIncludes = false
                for (let domain of list) {
                    if (this.ignoreTrailingDot) {
                        domain = domain.replace(/\.+$/, "")
                    }
                    if (domain == "") {
                        continue
                    }
                    let include: boolean
                    if (domain.charAt(0) == "~") {
                        include = false
                        domain = domain.substr(1)
                    } else {
                        include = true
                        hasIncludes = true
                    }
                    if (!domains) {
                        domains = createDict()
                    }
                    domains[domain] = include
                }
                if (domains) {
                    domains[""] = !hasIncludes
                }
            }
            this.domainSource = null
        }
        return this.domains
    }

    abstract getSitekeys(): string[]
    sitekeys: string[] | null = null
    isActiveOnDomain(docDomain: string, sitekey: string | null) {
        if (this.getSitekeys() && (!sitekey || this.getSitekeys().indexOf(sitekey.toUpperCase()) < 0)) {
            return false
        }
        if (!this.getDomains()) {
            return true
        }
        if (!docDomain) {
            return this.getDomains()![""]
        }
        if (this.ignoreTrailingDot) {
            docDomain = docDomain.replace(/\.+$/, "")
        }
        docDomain = docDomain.toUpperCase()
        while (true) {
            if (docDomain in this.getDomains()!) {
                return this.domains![docDomain]
            }
            let nextDot = docDomain.indexOf(".")
            if (nextDot < 0) {
                break
            }
            docDomain = docDomain.substr(nextDot + 1)
        }
        return this.domains![""]
    }

    isActiveOnlyOnDomain(docDomain: string) {
        if (!docDomain || !this.getDomains() || this.getDomains()![""]) {
            return false
        }
        if (this.ignoreTrailingDot) {
            docDomain = docDomain.replace(/\.+$/, "")
        }
        docDomain = docDomain.toUpperCase()
        for (let domain in this.getDomains()) {
            if (this.domains![domain] && domain != docDomain && (domain.length <= docDomain.length || domain.indexOf("." + docDomain) != domain.length - docDomain.length - 1)) {
                return false
            }
        }
        return true
    }

}

export class RegExpFilter extends ActiveFilter {
    regexp?: RegExp

    constructor(txt: string, regexpSource: string, contentType: number | null, matchCase: boolean, domains: string, thirdParty: boolean, sitekeys: string) {
        super(txt, domains)
        if (contentType != null) {
            this.contentType = contentType
        }
        if (matchCase) {
            this.matchCase = matchCase
        }
        if (thirdParty != null) {
            this.thirdParty = thirdParty
        }
        if (sitekeys != null) {
            this.sitekeySource = sitekeys
        }
        if (regexpSource.length >= 2 && regexpSource.charAt(0) == "/" && regexpSource.charAt(regexpSource.length - 1) == "/") {
            let regexp = new RegExp(regexpSource.substr(1, regexpSource.length - 2), this.matchCase ? "" : "i")
            this.regexp = regexp
        }
        else {
            this.regexpSource = regexpSource
        }
    }

    domainSourceIsUpperCase = true
    domainSeparator = "|"
    regexpSource: string | null = null
    getRegexp() {
        let prop = getOwnPropertyDescriptor(this, "regexp")
        if (prop) {
            return prop
        }
        let source = this.regexpSource?.replace(/\*+/g, "*").replace(/\^\|$/, "^").replace(/\W/g, "\\$&").replace(/\\\*/g, ".*").replace(/\\\^/g, "(?:[\\x00-\\x24\\x26-\\x2C\\x2F\\x3A-\\x40\\x5B-\\x5E\\x60\\x7B-\\x7F]|$)").replace(/^\\\|\\\|/, "^[\\w\\-]+:\\/+(?!\\/)(?:[^\\/]+\\.)?").replace(/^\\\|/, "^").replace(/\\\|$/, "$").replace(/^(\.\*)/, "").replace(/(\.\*)$/, "")
        let regexp = source ? new RegExp(source, this.matchCase ? "" : "i") : undefined
        this.regexp = regexp
        return regexp
    }
    contentType = 2147483647
    matchCase = false
    thirdParty: boolean | null = null
    sitekeySource: string | null = null
    getSitekeys() {
        let prop = getOwnPropertyDescriptor(this, "sitekeys")
        if (prop) {
            return prop
        }
        let sitekeys = null
        if (this.sitekeySource) {
            sitekeys = this.sitekeySource.split("|")
            this.sitekeySource = null
        }
        this.sitekeys = sitekeys
        return this.sitekeys
    }
    matches(location: string, contentType: number, docDomain: string, thirdParty: boolean | null, sitekey: string | null) {
        if (this.getRegexp().test(location) && this.isActiveOnDomain(docDomain, sitekey)) {
            return true
        }
        return false
    }

    static fromText(txt: string) {
        let blocking = true;
        let origText = txt;
        if (txt.indexOf("@@") == 0) {
            blocking = false;
            txt = txt.substr(2);
        }
        let contentType: number | null = null;
        let matchCase: boolean | null = null;
        let domains = null;
        let sitekeys = null;
        let thirdParty = null;
        let collapse = null;
        let options: string[] | null = null;
        let match = txt.indexOf("$") >= 0 ? Filter.optionsRegExp.exec(txt) : null;
        if (match) {
            options = match[1].toUpperCase().split(",");
            txt = match.input.substr(0, match.index);
            for (let _loopIndex6 = 0; _loopIndex6 < options.length; ++_loopIndex6) {
                let option = options[_loopIndex6];
                let value: string | null = null;
                let separatorIndex = option.indexOf("=");
                if (separatorIndex >= 0) {
                    value = option.substr(separatorIndex + 1);
                    option = option.substr(0, separatorIndex);
                }
                option = option.replace(/-/, "_");
                if (option in RegExpFilter.typeMap) {
                    if (contentType == null) {
                        contentType = 0;
                    }
                    contentType |= RegExpFilter.typeMap[option as TTypeMapKeys];
                }
                else if (option.charAt(0) == "~" && option.substr(1) in RegExpFilter.typeMap) {
                    if (contentType == null) {
                        contentType = RegExpFilter.prototype.contentType;
                    }
                    contentType &= ~RegExpFilter.typeMap[option.substr(1) as TTypeMapKeys];
                }
                else if (option == "MATCH_CASE") {
                    matchCase = true;
                }
                else if (option == "~MATCH_CASE") {
                    matchCase = false;
                }
                else if (option == "DOMAIN" && typeof value != "undefined") {
                    domains = value;
                }
                else if (option == "THIRD_PARTY") {
                    thirdParty = true;
                }
                else if (option == "~THIRD_PARTY") {
                    thirdParty = false;
                }
                else if (option == "COLLAPSE") {
                    collapse = true;
                }
                else if (option == "~COLLAPSE") {
                    collapse = false;
                }
                else if (option == "SITEKEY" && typeof value != "undefined") {
                    sitekeys = value;
                }
                else {
                    return new InvalidFilter(origText, "Unknown option " + option.toLowerCase());
                }
            }
        }
        if (!blocking && (contentType == null || contentType & RegExpFilter.typeMap.DOCUMENT) && (!options || options.indexOf("DOCUMENT") < 0) && !/^\|?[\w\-]+:/.test(txt)) {
            if (contentType == null) {
                contentType = RegExpFilter.prototype.contentType;
            }
            contentType &= ~RegExpFilter.typeMap.DOCUMENT;
        }
        try {
            if (blocking) {
                return new BlockingFilter(origText, txt, contentType, matchCase!, domains!, thirdParty!, sitekeys!, collapse);
            }
            else {
                return new WhitelistFilter(origText, txt, contentType, matchCase!, domains!, thirdParty!, sitekeys!);
            }
        }
        catch (e) {
            return new InvalidFilter(origText, e);
        }
    }
    static typeMap = c_typeMap
}

class BlockingFilter extends RegExpFilter {
    constructor(txt: string, regexpSource: string, contentType: number | null, matchCase: boolean, domains: string, thirdParty: boolean, sitekeys: string, collapse: unknown) {
        super(txt, regexpSource, contentType, matchCase, domains, thirdParty, sitekeys)
        this.collapse = collapse
    }
    collapse: unknown
}

class WhitelistFilter extends RegExpFilter {
    constructor(txt: string, regexpSource: string, contentType: number | null, matchCase: boolean, domains: string, thirdParty: boolean, sitekeys: string) {
        super(txt, regexpSource, contentType, matchCase, domains, thirdParty, sitekeys)
    }
}

class Matcher {

    constructor() {
        this.clear()
    }

    filterByKeyword: Record<string, Array<RegExpFilter> | RegExpFilter> = {}
    keywordByFilter: Record<string, string> = {}

    clear() {
        this.filterByKeyword = {}
        this.keywordByFilter = {}
    }

    add(filter: RegExpFilter) {
        if (filter.text && filter.text in this.keywordByFilter) {
            return;
        }
        let keyword = this.findKeyword(filter);
        let oldEntry = this.filterByKeyword[keyword];
        if (typeof oldEntry == "undefined") {
            this.filterByKeyword[keyword] = filter;
        }
        else if (oldEntry instanceof RegExpFilter) {
            this.filterByKeyword[keyword] = [oldEntry, filter];
        }
        else {
            oldEntry.push(filter);
        }
        if (filter.text) {
            this.keywordByFilter[filter.text] = keyword
        }
    }

    remove(filter: RegExpFilter) {
        if (!filter.text) {
            return
        }
        if (!(filter.text in this.keywordByFilter)) {
            return;
        }
        let keyword = this.keywordByFilter[filter.text];
        let list = this.filterByKeyword[keyword];
        if (list.length <= 1) {
            delete this.filterByKeyword[keyword];
        }
        else {
            let index = (list as Filter[]).indexOf(filter);
            if (index >= 0) {
                (list as Filter[]).splice(index, 1);
                if (list.length == 1) {
                    this.filterByKeyword[keyword] = [(list as RegExpFilter[])[0]];
                }
            }
        }
        delete this.keywordByFilter[filter.text];
    }

    findKeyword(filter: RegExpFilter) {
        let result = ""
        let text = filter.text ?? ""
        if (Filter.regexpRegExp.test(text)) {
            return result
        }
        let match = Filter.optionsRegExp.exec(text)
        if (match) {
            text = match.input.substr(0, match.index)
        }
        if (text.substr(0, 2) == "@@") {
            text = text.substr(2)
        }
        let candidates = text.toLowerCase().match(/[^a-z0-9%*][a-z0-9%]{3,}(?=[^a-z0-9%*])/g)
        if (!candidates) {
            return result
        }
        let hash = this.filterByKeyword
        let resultCount = 16777215
        let resultLength = 0

        for (const cand of candidates) {
            let candidate = cand.substr(1)
            let count = candidate in hash ? hash[candidate].length : 0
            if (count < resultCount || count == resultCount && candidate.length > resultLength) {
                [result, resultCount, resultLength] =
                    [candidate, count, candidate.length]
            }
        }
        return result;
    }

    hasFilter(filter: RegExpFilter) {
        if (filter.text == null) {
            return false
        }
        return filter.text in this.keywordByFilter;
    }
    getKeywordForFilter(filter: RegExpFilter) {
        if (filter.text && filter.text in this.keywordByFilter) {
            return this.keywordByFilter[filter.text];
        }
        else {
            return null;
        }
    }
    _checkEntryMatch(keyword: string, location: string, contentType: number, docDomain: string, thirdParty: boolean | null, sitekey: string | null) {
        let list = this.filterByKeyword[keyword]
        if (list instanceof RegExpFilter) {
            if (list.matches(location, contentType, docDomain, thirdParty, sitekey)) {
                return list
            }
        } else {
            for (const ft of list) {
                if (ft.matches(location, contentType, docDomain, thirdParty, sitekey)) {
                    return ft
                }
            }
        }
        return null
    }
    matchesAny(location: string, contentType: number, docDomain: string, thirdParty: boolean, sitekey: string) {
        let candidates = location.toLowerCase().match(/[a-z0-9%]{3,}/g)
        if (candidates === null) {
            candidates = []
        }
        candidates.push("")
        for (let i = 0, l = candidates.length; i < l; i++) {
            let substr = candidates[i];
            if (substr in this.filterByKeyword) {
                let result = this._checkEntryMatch(substr, location, contentType, docDomain, thirdParty, sitekey);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

}

export class CombinedMatcher {
    constructor() {
        this.blacklist = new Matcher()
        this.whitelist = new Matcher()
        this.resultCache = createDict()
    }

    blacklist: Matcher
    whitelist: Matcher
    resultCache: Record<string, Nullable<RegExpFilter>>

    static maxCacheEntries = 1000

    cacheEntries = 0

    clear() {
        this.blacklist.clear();
        this.whitelist.clear();
        this.resultCache = createDict();
        this.cacheEntries = 0;
    }

    add(filter: RegExpFilter) {
        if (filter instanceof WhitelistFilter) {
            this.whitelist.add(filter);
        }
        else {
            this.blacklist.add(filter);
        }
        if (this.cacheEntries > 0) {
            this.resultCache = createDict();
            this.cacheEntries = 0;
        }
    }

    remove(filter: RegExpFilter) {
        if (filter instanceof WhitelistFilter) {
            this.whitelist.remove(filter);
        }
        else {
            this.blacklist.remove(filter);
        }
        if (this.cacheEntries > 0) {
            this.resultCache = createDict();
            this.cacheEntries = 0;
        }
    }

    findKeyword(filter: RegExpFilter) {
        if (filter instanceof WhitelistFilter) {
            return this.whitelist.findKeyword(filter);
        }
        else {
            return this.blacklist.findKeyword(filter);
        }
    }

    hasFilter(filter: RegExpFilter) {
        if (filter instanceof WhitelistFilter) {
            return this.whitelist.hasFilter(filter);
        }
        else {
            return this.blacklist.hasFilter(filter);
        }
    }

    getKeywordForFilter(filter: RegExpFilter) {
        if (filter instanceof WhitelistFilter) {
            return this.whitelist.getKeywordForFilter(filter);
        }
        else {
            return this.blacklist.getKeywordForFilter(filter);
        }
    }

    isSlowFilter(filter: RegExpFilter) {
        let matcher = filter instanceof WhitelistFilter ? this.whitelist : this.blacklist;
        if (matcher.hasFilter(filter)) {
            return !matcher.getKeywordForFilter(filter);
        }
        else {
            return !matcher.findKeyword(filter);
        }
    }

    matchesAnyInternal(location: string, contentType: number, docDomain: string, thirdParty: boolean | null, sitekey: string | null) {
        let candidates = location.toLowerCase().match(/[a-z0-9%]{3,}/g);
        if (candidates === null) {
            candidates = [];
        }
        candidates.push("");
        let blacklistHit = null;
        for (const cand of candidates) {
            let substr = cand
            if (substr in this.whitelist.filterByKeyword) {
                let result = this.whitelist._checkEntryMatch(substr, location, contentType, docDomain, thirdParty, sitekey)
                if (result) {
                    return result
                }
            }
            if (substr in this.blacklist.filterByKeyword && blacklistHit === null) {
                blacklistHit = this.blacklist._checkEntryMatch(substr, location, contentType, docDomain, thirdParty, sitekey)
            }
        }
        return blacklistHit;
    }

    matchesAny(location: string, docDomain: string) {
        let key = location + " " + docDomain + " ";
        if (key in this.resultCache) {
            return this.resultCache[key];
        }
        let result = this.matchesAnyInternal(location, 0, docDomain, null, null);
        if (this.cacheEntries >= CombinedMatcher.maxCacheEntries) {
            this.resultCache = createDict();
            this.cacheEntries = 0;
        }
        this.resultCache[key] = result;
        this.cacheEntries += 1;
        return result;
    }
}
