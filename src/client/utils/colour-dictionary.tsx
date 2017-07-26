export class ColorDictionary {
    private colorDictionary = [
        { color: '#000000', usage: 0 },
        { color: '#00FF00', usage: 0 },
        { color: '#FF0000', usage: 0 },
        { color: '#0000FF', usage: 0 },
        { color: '#FF00FF', usage: 0 },
        { color: '#FFFF00', usage: 0 },
        { color: '#00FFFF', usage: 0 }
    ];

    public getColorByIndex(index: number) {
        return this.colorDictionary[index].color;
    }

    public getFirstFreeColor(): string {
        for (var index = 0; index < this.colorDictionary.length; index++) {
            if (this.colorDictionary[index].usage === 0) {
                this.colorDictionary[index].usage = 1;
                return this.colorDictionary[index].color;
            }
        }

        return 'black';
    }

    public freeColor(colorName: string) {
        for (var index = 0; index < this.colorDictionary.length; index++) {
            if (this.colorDictionary[index].color === colorName) {
                this.colorDictionary[index].usage = 0;
            }
        }
    }
}