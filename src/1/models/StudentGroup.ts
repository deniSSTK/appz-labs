export class StudentGroup {
  constructor(
    public name: string,
    public course: number,
    public size: number
  ) {}

  getSubgroups(minSize: number = 10): number {
    return Math.floor(this.size / minSize);
  }
}
