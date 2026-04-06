import { DisciplineEventArgs } from './DisciplineEventArgs';

export interface IDisciplineObserver {
  update(eventArgs: DisciplineEventArgs): void;
}

export class DisciplineNotifier {
  private observers: Set<IDisciplineObserver> = new Set();

  public subscribe(observer: IDisciplineObserver): void {
    this.observers.add(observer);
  }

  public unsubscribe(observer: IDisciplineObserver): void {
    this.observers.delete(observer);
  }

  public notify(message: string, sender: string): void {
    const eventArgs = new DisciplineEventArgs(message, sender);
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public getObserverCount(): number {
    return this.observers.size;
  }
}
