import { v4 as uuidv4 } from 'uuid';

export class Student {
  constructor(
    private readonly name: string,
    private readonly id: string = uuidv4()
  ) {}

  public getName(): string {
    return this.name;
  }

  public getId(): string {
    return this.id;
  }
}
