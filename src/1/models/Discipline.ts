import { Teacher } from './Teacher';
import { StudentGroup } from './StudentGroup';

export abstract class Discipline {
    protected completedWorks: Map<string, number> = new Map();
    
    constructor(
        public title: string,
        public teacher: Teacher | null = null,
        public targetCourses: number[],
        public onNotify: (msg: string) => void = () => {}
    ) {}

    assignTeacher(t: Teacher): void {
        if (t.isBusy) {
            throw new Error(`Teacher ${t.name} is already busy`);
        }
        this.teacher = t;
        t.assign();
        this.onNotify(`Teacher ${t.name} assigned to ${this.title}`);
    }

    canEnroll(group: StudentGroup): boolean {
        if (group.course >= 3) {
            throw new Error(`Groups with course 3+ cannot enroll in disciplines`);
        }
        if (group.size < 13) {
            throw new Error(`Group size must be at least 13 students (current: ${group.size})`);
        }
        if (!this.targetCourses.includes(group.course)) {
            throw new Error(`${this.title} is not available for course ${group.course}`);
        }
        return true;
    }

    checkExamAccess(studentId: string): boolean {
        const completedWorkCount = this.completedWorks.get(studentId) || 0;
        const requiredWorkCount = this.getRequiredWorkCount();
        
        if (completedWorkCount < requiredWorkCount) {
            throw new Error(`Student ${studentId} needs ${requiredWorkCount - completedWorkCount} more works to access exam`);
        }
        return true;
    }

    protected abstract getRequiredWorkCount(): number;

    submitWork(studentId: string): void {
        const current = this.completedWorks.get(studentId) || 0;
        this.completedWorks.set(studentId, current + 1);
        this.onNotify(`Student ${studentId} submitted work for ${this.title} (${current + 1}/${this.getRequiredWorkCount()})`);
    }

    abstract conductLecture?(): void;
    abstract conductPractice?(): void;
}
