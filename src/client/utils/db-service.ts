import * as localForage from 'localforage';

interface StorageConfig {
    driver: string;
    name: string;
    version: number;
    storeName: string;
    description: string;
}

export default class DbService {
    private storage: LocalForage;

    /**
     * Constructor of fileStorage which create instace of localForage for storing data to IndexedDB.
     * @param reducer is reducer of application.
     */
    public constructor(config: StorageConfig) {
        this.storage = localForage.createInstance(config);
    }

    public setItem<Entry>(key: string, entry: Entry): Promise<Entry> {
        return this.storage.setItem<Entry>(key, entry);
    }

    public setItems<Entry>(entries: { key: string; entry: Entry }[]): Promise<Entry[]> {
        const promises = entries.map(entry => {
            return this.storage.setItem(entry.key, entry.entry);
        });

        return Promise.all(promises);
    }

    public getItem<Entry>(key: string): Promise<Entry> {
        return this.storage.getItem<Entry>(key);
    }

    public getItems<Entry>(keys: string[]): Promise<Entry[]> {
        return Promise.all(keys.map(key => {
            return this.getItem<Entry>(key);
        }));
    }

    public getCount(): Promise<number> {
        return this.storage.keys().then(keys => {
            return keys.length;
        });
    }

    public async getAll<Entry>(): Promise<Entry[]> {
        const keys = await this.storage.keys();
        
        const promises = keys.map(key => {
            return this.getItem<Entry>(key);
        });
        return Promise.all(promises);
    }

    public removeItem(key: string): Promise<void> {
        return this.storage.removeItem(key);
    }

    public removeItems(keys: string[]): Promise<void> {
        const promises = keys.map(key => {
            return this.storage.removeItem(key);
        });
        return Promise.all(promises)
            .then(() => {
               return; 
            });
    }
}
