import { Stroke } from './stroke';
import { DrawingEntry } from './drawing-entry';


export class DbService {

    private static DRAWINGS_STORE = "drawings";

    private db: IDBDatabase;

    public open(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let request: IDBOpenDBRequest = indexedDB.open("painter", 1.0);
            request.onupgradeneeded = _ => this.upgrade(_);

            request.onsuccess = _ => {
                this.db = request.result;
                resolve();
            };

            request.onerror = _ => reject((<any>_.target).errorCode);
        })
    }

    private upgrade(event: IDBVersionChangeEvent) {
        let db = (<any>event.target).result as IDBDatabase;
        let store = db.createObjectStore(DbService.DRAWINGS_STORE, { keyPath: "name" });
        let defaultDrawing: DrawingEntry = {
            name: "default",
            strokes: []
        };
        store.add(defaultDrawing);
    }

    public addDrawing(name: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let transaction = this.db.transaction(DbService.DRAWINGS_STORE, "readwrite");
            let store = transaction.objectStore(DbService.DRAWINGS_STORE);
            let drawing: DrawingEntry = { name: name, strokes: [] };
            store.add(drawing);

            transaction.oncomplete = () => resolve();
            transaction.onerror = _ => reject((<any>_.target).errorCode);
        });
    }

     public updateDrawingStrokes(name: string, strokes: Stroke[]): Promise<void> {
        return new Promise<void>((resolve, reject)=>{
            let transaction = this.db.transaction(DbService.DRAWINGS_STORE,"readwrite");
            let store = transaction.objectStore(DbService.DRAWINGS_STORE);

            let getRequest = store.get(name);
            getRequest.onsuccess = _ => {
                let drawing = getRequest.result as DrawingEntry;
                if(drawing)
                {
                    drawing.strokes = strokes;
                    let putRequest = store.put(drawing);
                    putRequest.onsuccess = _=> resolve();
                }
            }

            transaction.onerror = _ => reject((<any>_.target).errorCode);                        
        });
    }

    public getDrawingStrokes(name:string): Promise<Stroke[]> {
        return new Promise<DrawingEntry>((resolve, reject)=>{
            let transaction = this.db.transaction(DbService.DRAWINGS_STORE,"readonly");
            let store = transaction.objectStore(DbService.DRAWINGS_STORE);

            let request = store.get(name);
            request.onsuccess = _ => resolve(request.result as DrawingEntry);
            transaction.onerror = _ => reject((<any>_.target).errorCode);
        }).then(entry =>  entry.strokes);
    }

    public getDrawings(): Promise<DrawingEntry[]> {
        return new Promise<DrawingEntry[]>((resolve, reject)=>{
            let transaction = this.db.transaction(DbService.DRAWINGS_STORE,"readonly");
            let store = transaction.objectStore(DbService.DRAWINGS_STORE);

            let drawings: DrawingEntry[] = []
            store.openCursor().onsuccess = _ => {
                var cursor = (<any>_.target).result as IDBCursorWithValue;
                if (cursor) {
                    drawings.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(drawings);
                }
            };            
            transaction.onerror = _ => reject((<any>_.target).errorCode);
        });
    }
}