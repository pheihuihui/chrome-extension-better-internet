import { TinyDB, PendingContent } from "../Analyzor/DB"
import React, { useState, useRef, useEffect } from "react"
import { MessageType } from "../background"

export const LogArea = () => {
    const [list, setList] = useState([] as PendingContent[])
    useInterval(() => {
        chrome.runtime.sendMessage({ method: 'get', list: 'recent' } as MessageType, resp => {
            if (resp) {
                setList(resp as PendingContent[])
            } else {
                setList([])
            }
            console.log('received')
        })
    }, 2000)
    return (
        <div>
            {list.map(x => <div>{x.url}</div>)}
        </div>
    )
}

export const logs = <LogArea />

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef(callback);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

