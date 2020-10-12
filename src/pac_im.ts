class Filter {
    static elemhideRegExp = /^([^\/\*\|\@"!]*?)#(\@)?(?:([\w\-]+|\*)((?:\([\w\-]+(?:[$^*]?=[^\(\)"]*)?\))*)|#([^{}]+))$/;
    static regexpRegExp = /^(@@)?\/.*\/(?:\$~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)?$/;
    static optionsRegExp = /\$(~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)$/;

    text: string
    subscriptions: string[]

    constructor(txt: string) {
        this.text = txt
        this.subscriptions = []
    }

    toString() {
        return this.text
    }

    static fromText(txt: string) {

    }
}


class InvalidFilter extends Filter {
    reason: string | null = null
    constructor(txt: string, reason: string) {
        super(txt)
        this.reason = reason
    }
}

class CommentFilter extends Filter {
    constructor(txt: string) {
        super(txt)
    }
}

export function _testPacTs() {
    return 1
}