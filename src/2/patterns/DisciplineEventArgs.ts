export class DisciplineEventArgs {
  constructor(
    public readonly message: string,
    public readonly sender: string,
    public readonly timestamp: Date = new Date()
  ) {}
}
