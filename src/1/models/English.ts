import { Discipline } from './Discipline';

export class English extends Discipline {
    constructor(
        public hasAudioEquipment: boolean = false,
        onNotify: (msg: string) => void = () => {}
    ) {
        super('English', null, [1, 2], onNotify);
    }

    protected getRequiredWorkCount(): number {
        return 0;
    }

    conductListening(): void {
        if (!this.hasAudioEquipment) {
            throw new Error('Audio equipment is required for listening exercises');
        }
        this.onNotify('English listening exercise conducted successfully');
    }

    autoCredit(): void {
        this.onNotify('English credit assigned automatically');
    }

    conductLecture(): void {
        if (!this.teacher) {
            throw new Error('No teacher assigned for English lecture');
        }
        this.onNotify(`English lecture conducted by ${this.teacher.name}`);
    }

    conductPractice(): void {
        if (!this.teacher) {
            throw new Error('No teacher assigned for English practice');
        }
        this.onNotify(`English practice conducted by ${this.teacher.name}`);
    }
}
