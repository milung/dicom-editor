import { ApplicationStateReducer } from './application-state';
import { DbService } from './db-service';
import * as lodash from 'lodash';


export class DbConnect {
    public constructor(db: DbService, reducer: ApplicationStateReducer) {
        this.init(db, reducer);
    }

    private async init(db: DbService, reducer: ApplicationStateReducer): Promise<void> {
        await db.open();
        let drawings = await db.getDrawings();
        reducer.resetDrawings(drawings);
        reducer.state$
            .subscribe(state => db.updateDrawingStrokes(
                state.currentDrawing, state.currentStrokes));

        reducer.state$.map(_ => _.drawings)
            .subscribe(appDrawings => {
                db.getDrawings().then(dbDrawings => {
                    let appNames = appDrawings.map(_ => _.name);
                    let dbNames = dbDrawings.map(_ => _.name);

                    lodash
                        .difference(appNames, dbNames)
                        .forEach(drawingName => db.addDrawing(drawingName));
                });
            });
    }
}