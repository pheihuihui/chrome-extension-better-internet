type RequestType = 'white' | 'pac_personal' | 'pac_gfw' | 'blocked' | 'ignored' | 'unknown'

type RequestItem = {
    [requestDomain: string]: {
        requestCount: number
        requestTimestamp: number
        domainRegion?: string
    }
}

type RequestStatistics = {
    [requestType in keyof RequestType]: RequestItem[]
}
