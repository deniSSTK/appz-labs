import { Discipline } from './Discipline';

export class HigherMath extends Discipline {
  constructor(onNotify: (msg: string) => void = () => {}) {
    super('Higher Mathematics', null, [1, 2], onNotify);
  }

  protected getRequiredWorkCount(): number {
    return 5;
  }

  conductLecture(): void {
    if (!this.teacher) {
      throw new Error('No teacher assigned for Higher Mathematics lecture');
    }
    this.onNotify(`Higher Mathematics lecture conducted by ${this.teacher.name}`);
  }

  conductPractice(): void {
    if (!this.teacher) {
      throw new Error('No teacher assigned for Higher Mathematics practice');
    }
    this.onNotify(`Higher Mathematics practice conducted by ${this.teacher.name}`);
  }
}
