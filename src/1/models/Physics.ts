import { Discipline } from './Discipline';
import { StudentGroup } from './StudentGroup';

export class Physics extends Discipline {
    constructor(
        public hasLaboratory: boolean = false,
        onNotify: (msg: string) => void = () => {}
    ) {
        super("Physics", null, [1], onNotify);
    }

    protected getRequiredWorkCount(): number {
        return 3;
    }

    conductLab(group: StudentGroup): void {
        if (!this.hasLaboratory) {
            throw new Error("Laboratory is required for Physics lab work");
        }

        this.canEnroll(group);
        
        const maxSubgroups = Math.floor(group.size / 10);
        if (maxSubgroups === 0) {
            throw new Error(`Group of ${group.size} students is too small for laboratory work (minimum 10 required)`);
        }
        
        if (maxSubgroups >= 1) {
            this.onNotify(`Physics lab conducted for group ${group.name} (${maxSubgroups} subgroup(s) of 10+ students)`);
        }
    }

    conductLecture(): void {
        if (!this.teacher) {
            throw new Error("No teacher assigned for Physics lecture");
        }
        this.onNotify(`Physics lecture conducted by ${this.teacher.name}`);
    }

    conductPractice(): void {
        if (!this.teacher) {
            throw new Error("No teacher assigned for Physics practice");
        }
        this.onNotify(`Physics practice conducted by ${this.teacher.name}`);
    }
}
