import { Teacher } from '../models/Teacher';
import { Discipline } from '../models/Discipline';
import { DisciplineNotifier } from '../patterns/DisciplineNotifier';
import { Group } from '../models/Group';
import { DisciplineType } from '../models/DisciplineType';
import {
  PhysicsValidation,
  EnglishValidation,
  StandardValidation
} from '../strategies/ValidationStrategies';
import { Activity, ActivityType } from '../models/Activity';

export class Physics extends Discipline {
  constructor(teacher: Teacher, notifier: DisciplineNotifier, group: Group) {
    super('Physics', teacher, new PhysicsValidation(), notifier, group);
  }

  protected initializeActivities(): void {
    this.activities = [
      new Activity(ActivityType.LECTURE, 'Physics Lecture'),
      new Activity(ActivityType.LABORATORY, 'Physics Laboratory Work'),
      new Activity(ActivityType.COURSEWORK, 'Physics Coursework'),
      new Activity(ActivityType.MODULAR_TEST, 'Physics Modular Test'),
      new Activity(ActivityType.EXAM, 'Physics Final Exam')
    ];
  }
}

export class English extends Discipline {
  constructor(teacher: Teacher, notifier: DisciplineNotifier, group: Group) {
    super('English', teacher, new EnglishValidation(), notifier, group);
  }

  protected initializeActivities(): void {
    this.activities = [
      new Activity(ActivityType.PRACTICE, 'English Practice'),
      new Activity(ActivityType.MODULAR_TEST, 'English Modular Test'),
      new Activity(ActivityType.CREDIT, 'English Credit')
    ];
  }
}

export class Math extends Discipline {
  constructor(teacher: Teacher, notifier: DisciplineNotifier, group: Group) {
    super('Math', teacher, new StandardValidation(), notifier, group);
  }

  protected initializeActivities(): void {
    this.activities = [
      new Activity(ActivityType.LECTURE, 'Math Lecture'),
      new Activity(ActivityType.PRACTICE, 'Math Practice'),
      new Activity(ActivityType.COURSEWORK, 'Math Coursework'),
      new Activity(ActivityType.MODULAR_TEST, 'Math Modular Test'),
      new Activity(ActivityType.EXAM, 'Math Final Exam')
    ];
  }
}

export class DisciplineFactory {
  public static createDiscipline(
    type: DisciplineType,
    teacher: Teacher,
    notifier: DisciplineNotifier,
    group: Group
  ): Discipline {
    switch (type) {
      case DisciplineType.PHYSICS:
        return new Physics(teacher, notifier, group);
      case DisciplineType.ENGLISH:
        return new English(teacher, notifier, group);
      case DisciplineType.MATH:
        return new Math(teacher, notifier, group);
      default:
        throw new Error(`Unknown discipline type: ${type}`);
    }
  }

  public static getAvailableDisciplines(): DisciplineType[] {
    return [DisciplineType.PHYSICS, DisciplineType.ENGLISH, DisciplineType.MATH];
  }
}
