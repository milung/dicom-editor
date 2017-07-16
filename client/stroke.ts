
export interface Coordinates {
    x: number, y: number
}

export class Stroke {
    public points: Coordinates[];

    public constructor( startPoint: Coordinates, public color:string) {
        this.points = [ startPoint ];
    }
}