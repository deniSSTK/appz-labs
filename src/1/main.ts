import { Teacher } from './models/Teacher';
import { StudentGroup } from './models/StudentGroup';
import { Physics } from './models/Physics';
import { English } from './models/English';

function main() {
    console.log('=== University Management System Demo ===\n');

    const eventHandler = (message: string) => {
        console.log(`[EVENT] ${message}`);
    };

    const teacher = new Teacher('Dr. Smith');
    const group = new StudentGroup('CS-101', 1, 25);
    const physics = new Physics(false, eventHandler);

    console.log(`Created teacher: ${teacher.name}`);
    console.log(`Created group: ${group.name} (Course ${group.course}, ${group.size} students)`);
    console.log(`Created physics discipline (no laboratory)\n`);

    try {
        physics.assignTeacher(teacher);
        console.log('Teacher assigned successfully\n');
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }

    console.log('--- Attempting to conduct lab without laboratory ---');
    try {
        physics.conductLab(group);
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    console.log();

    console.log('--- Adding laboratory and conducting lab ---');
    physics.hasLaboratory = true;
    try {
        physics.conductLab(group);
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    console.log();

    console.log('--- Attempting exam without completed works ---');
    const studentId = 'student001';
    try {
        physics.checkExamAccess(studentId);
        console.log('Exam access granted');
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    console.log();

    console.log('--- Submitting works and conducting exam ---');
    try {
        for (let i = 1; i <= 3; i++) {
            physics.submitWork(studentId);
        }

        physics.checkExamAccess(studentId);
        console.log('Exam access granted - all requirements met!');

        if (physics.teacher) {
            eventHandler(`Exam conducted by ${physics.teacher.name} for student ${studentId}`);
        }
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    console.log('\n=== English Discipline Demo ===');
    const english = new English(true, eventHandler);

    try {
        english.assignTeacher(teacher);
        console.log('Teacher assigned to English');
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
        english.autoCredit();
        console.log('English credit assigned automatically');
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    console.log('\n=== Demo Complete ===');
}

main();
