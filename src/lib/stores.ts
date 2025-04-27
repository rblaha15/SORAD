import {browser} from '$app/environment';
import {get, writable, type Writable} from 'svelte/store';

type GetStoreable = {
    <T>(key: string): Writable<T | undefined>;
    <T>(key: string, defaultValue: T): Writable<T>;
};

export const storeable: GetStoreable = <T>(key: string, defaultValue?: T) => {
    const store = writable<T | undefined>(defaultValue);
    key = `storable_${key}`;

    if (browser) {
        const currentValue = localStorage.getItem(key);
        if (currentValue != null && currentValue != 'undefined' && currentValue != 'null')
            store.set(JSON.parse(currentValue));
        else if (defaultValue != undefined) localStorage.setItem(key, JSON.stringify(defaultValue));
    }

    const _storeable: Writable<T | undefined> = {
        subscribe: store.subscribe,
        set: (value) => {
            if (browser)
                if (value != undefined)
                    localStorage.setItem(key, JSON.stringify(value))
                else
                    localStorage.removeItem(key);
            store.set(value);
        },
        update: (updater) => {
            const updated = updater(get(store));

            if (browser)
                if (updated != undefined)
                    localStorage.setItem(key, JSON.stringify(updated))
                else
                    localStorage.removeItem(key);
            store.set(updated);
        }
    };
    return _storeable;
};

export const value = <T>(state: { get: () => T, set: (v: T) => void }) => ({
    get current() {
        return state.get()
    },
    set current(v: T) {
        state.set(v)
    },
})

export const propertyValue = <T, K extends keyof T>(key: K, state: { get: () => T, set: (v: T) => void }) => ({
    get current() {
        return state.get()[key]
    },
    set current(v: T[K]) {
        state.set({ ...state.get(), [key]: v })
    },
})