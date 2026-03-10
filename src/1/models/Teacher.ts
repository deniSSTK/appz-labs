export class Teacher {
    constructor(
        public name: string,
        public isBusy: boolean = false
    ) {}

    assign(): void {
        if (this.isBusy) {
            throw new Error(`Teacher ${this.name} is already busy`);
        }
        this.isBusy = true;
    }

    release(): void {
        this.isBusy = false;
    }
}
