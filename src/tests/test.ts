import { CombinedMatcher, Filter, RegExpFilter } from "../pac_im";
import { testRules } from "./testRules";

let defaultM = new CombinedMatcher()
for (const rule of testRules) {
    defaultM.add(Filter.fromText(rule) as RegExpFilter)
}

for (const mc in defaultM.whitelist.filterByKeyword) {
    if (Object.prototype.hasOwnProperty.call(defaultM.whitelist.filterByKeyword, mc)) {
        const element = defaultM.whitelist.filterByKeyword[mc];
        console.log(element.toString())
    }
}

for (const mc in defaultM.blacklist.filterByKeyword) {
    if (Object.prototype.hasOwnProperty.call(defaultM.blacklist.filterByKeyword, mc)) {
        const element = defaultM.blacklist.filterByKeyword[mc];
        console.log(element.toString())
    }
}