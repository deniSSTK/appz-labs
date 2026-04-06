import { Teacher } from './Teacher';
import { Student } from './Student';
import { IValidationStrategy } from '../strategies/ValidationStrategies';
import { DisciplineNotifier } from '../patterns/DisciplineNotifier';

export abstract class Discipline {
    protected students: Student[] = [];
    protected courseCount: number = 0;

    protected constructor(
        protected readonly name: string,
        protected readonly teacher: Teacher,
        protected readonly validationStrategy: IValidationStrategy,
        protected readonly notifier: DisciplineNotifier
    ) {}

    public getName(): string {
        return this.name;
    }

    public getTeacher(): Teacher {
        return this.teacher;
    }

    public getStudentCount(): number {
        return this.students.length;
    }

    public getActivityRequirements(): string[] {
        return this.validationStrategy.getActivityRequirements();
    }

    public enrollStudent(student: Student): boolean {
        const validation = this.validationStrategy.validateEnrollment(
            this.students.length,
            this.teacher,
            this.courseCount
        );

        if (!validation.isValid) {
            this.notifier.notify(
                `Failed to enroll ${student.getName()}: ${validation.message}`,
                this.name
            );
            return false;
        }

        this.students.push(student);
        this.notifier.notify(
            `Successfully enrolled ${student.getName()} in ${this.name}`,
            this.name
        );
        return true;
    }

    public startCourse(): boolean {
        if (this.students.length < 13) {
            this.notifier.notify(
                `Cannot start ${this.name}: insufficient students (${this.students.length}/13)`,
                this.name
            );
            return false;
        }

        if (this.teacher.isBusy()) {
            this.notifier.notify(
                `Cannot start ${this.name}: teacher ${this.teacher.getName()} is busy`,
                this.name
            );
            return false;
        }

        this.teacher.lock();
        this.courseCount++;
        this.notifier.notify(
            `Course ${this.name} started with ${this.students.length} students`,
            this.name
        );
        return true;
    }

    public endCourse(): void {
        this.teacher.unlock();
        this.notifier.notify(`Course ${this.name} ended`, this.name);
    }

    public canCreateSubgroup(): boolean {
        return this.students.length >= 10;
    }
}
