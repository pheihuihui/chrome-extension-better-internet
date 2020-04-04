export type ButtonState = 'ready' | 'collecting'
export type StatusType = 'success' | 'error'
export type RecordType = 'start' | 'error' | 'complete'
export type StringIndexable<V> = { [index: string]: V }
export type NumberIndexable<V> = { [index: number]: V }

export interface ValueType {
    content: string
}

export interface RequestDetails {
    requestID: number
    url: string
    timeSpent: number
    resultStatus: StatusType
    comments?: RawRecord[]
}

export interface RawRecord {
    requestID: string
    recordType: RecordType
    url: string
    timeStamp: number
    statusCode?: number
}

export interface DomainStatistics {
    [domain: string]: RequestDetails[]
}

export interface DomainListProps {
    domains: DomainStatistics,
    pac: string[]
}

export interface DomainListState {
    domains: DomainStatistics,
    pac: string[],
    selectedUrls: number[]
}

export interface UrlItemProps {
    domain: string,
    pac: string[],
    details: RequestDetails[]
}

export interface UrlItemState {
    id: number,
    selected: boolean
}

export interface RequestItemProps {
    requests: RawRecord[]
}

export interface V2RayMessage {
    newPac: string[]
    needRestart: boolean
}