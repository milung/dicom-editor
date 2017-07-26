export class ColourDictionary {
    private colourDictionary = [
        {color: '#000000', usage: 0},
        {color: '#00FF00', usage: 0},
        {color: '#FF0000', usage: 0},
        {color: '#0000FF', usage: 0},
        {color: '#FF00FF', usage: 0},
        {color: '#FFFF00', usage: 0},
        {color: '#00FFFF', usage: 0}
    ];

    public getColourByIndex(index: number) {
        return this.colourDictionary[index].color;
    }

    public getFirstFreeColor(): number {
        for (var index = 0; index < this.colourDictionary.length; index++) {
            if (this.colourDictionary[index].usage === 0) {
                this.colourDictionary[index].usage = 1;
                return index;
            }
        }

        return 0;
    }

    public freeColor(colorIndex: number) {
        this.colourDictionary[colorIndex].usage = 0;
    }
}