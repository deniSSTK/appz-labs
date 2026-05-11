export enum ActivityType {
  LECTURE = 'Lecture',
  PRACTICE = 'Practice',
  LABORATORY = 'Laboratory',
  COURSEWORK = 'Coursework',
  MODULAR_TEST = 'Modular Test',
  EXAM = 'Exam',
  CREDIT = 'Credit'
}

export interface IActivity {
  type: ActivityType;
  name: string;
  isCompleted: boolean;
  isSubmitted: boolean;
  grade?: number;
  completedAt?: Date;
}

export class Activity implements IActivity {
  constructor(
    public readonly type: ActivityType,
    public readonly name: string,
    public isCompleted: boolean = false,
    public isSubmitted: boolean = false,
    public grade?: number,
    public completedAt?: Date
  ) {}

  public complete(grade?: number): void {
    this.isCompleted = true;
    this.grade = grade;
    this.completedAt = new Date();
  }

  public submit(): void {
    if (!this.isCompleted) {
      throw new Error('Cannot submit incomplete activity');
    }
    this.isSubmitted = true;
  }

  public getStatus(): string {
    if (!this.isCompleted) return 'Not Started';
    if (!this.isSubmitted) return 'Completed (Not Submitted)';
    return `Submitted${this.grade ? ` (Grade: ${this.grade})` : ''}`;
  }
}
