import { browser } from '$app/environment';
import {get, readable, type Readable, writable, type Writable} from 'svelte/store';

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

type CreateWriteableScope<T> = (update: (value: T) => void) => void
type GetCreateWriteable = {
	<T>(create: CreateWriteableScope<T>): Writable<T | undefined>;
	<T>(create: CreateWriteableScope<T>, defaultValue: T): Writable<T>;
};

export const createWriteable: GetCreateWriteable = <T>(create: CreateWriteableScope<T>, defaultValue?: T) => {
	const store = writable<T | undefined>(defaultValue);
	create(value => {
		store.set(value)
	})
	return store
}