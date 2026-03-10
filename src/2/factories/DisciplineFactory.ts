import { Teacher } from '../models/Teacher';
import { Discipline } from '../models/Discipline';
import { DisciplineNotifier } from '../patterns/DisciplineNotifier';
import { 
    PhysicsValidation,
    EnglishValidation, 
    StandardValidation 
} from '../strategies/ValidationStrategies';

export class Physics extends Discipline {
    constructor(teacher: Teacher, notifier: DisciplineNotifier) {
        super('Physics', teacher, new PhysicsValidation(), notifier);
    }
}

export class English extends Discipline {
    constructor(teacher: Teacher, notifier: DisciplineNotifier) {
        super('English', teacher, new EnglishValidation(), notifier);
    }
}

export class Math extends Discipline {
    constructor(teacher: Teacher, notifier: DisciplineNotifier) {
        super('Math', teacher, new StandardValidation(), notifier);
    }
}

export class DisciplineFactory {
    public static createDiscipline(
        type: 'physics' | 'english' | 'math',
        teacher: Teacher,
        notifier: DisciplineNotifier
    ): Discipline {
        switch (type.toLowerCase()) {
            case 'physics':
                return new Physics(teacher, notifier);
            case 'english':
                return new English(teacher, notifier);
            case 'math':
                return new Math(teacher, notifier);
            default:
                throw new Error(`Unknown discipline type: ${type}`);
        }
    }

    public static getAvailableDisciplines(): string[] {
        return ['physics', 'english', 'math'];
    }
}
