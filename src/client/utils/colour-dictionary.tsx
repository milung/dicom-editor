export class ColorDictionary {
    private colorDictionary = [
        { color: '#00BB00', usage: 0 },
        { color: '#BB0000', usage: 0 },
        { color: '#0000BB', usage: 0 },
        { color: '#BB00BB', usage: 0 },
        { color: '#BBBB00', usage: 0 },
        { color: '#00BBBB', usage: 0 },
        { color: '#000000', usage: 0 }
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

    public reset() {
        for (var index = 0; index < this.colorDictionary.length; index++) {
            this.colorDictionary[index].usage = 0;
        }
    }
}