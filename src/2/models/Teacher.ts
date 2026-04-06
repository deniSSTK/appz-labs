export class Teacher {
  constructor(
    private readonly name: string,
    private busyStatus: boolean = false
  ) {}

  public getName(): string {
    return this.name;
  }

  public isBusy(): boolean {
    return this.busyStatus;
  }

  public lock(): void {
    this.busyStatus = true;
  }

  public unlock(): void {
    this.busyStatus = false;
  }
}
