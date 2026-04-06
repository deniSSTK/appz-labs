export class Student {
  constructor(
    private readonly name: string,
    private readonly id: string
  ) {}

  public getName(): string {
    return this.name;
  }

  public getId(): string {
    return this.id;
  }
}
