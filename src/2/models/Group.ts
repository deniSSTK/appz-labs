import { DisciplineType } from '../models/DisciplineType';

export class Group {
  constructor(
    public readonly name: string,
    public readonly currentYear: number,
    public readonly students: string[] = []
  ) {}

  public canStudyDiscipline(disciplineName: string): boolean {
    switch (disciplineName.toLowerCase()) {
      case DisciplineType.PHYSICS:
        return this.currentYear === 1;
      case DisciplineType.MATH:
      case DisciplineType.ENGLISH:
        return this.currentYear === 1 || this.currentYear === 2;
      default:
        return false;
    }
  }

  public getYear(): number {
    return this.currentYear;
  }
}
