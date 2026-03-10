import { Teacher } from './models/Teacher';
import { Student } from './models/Student';
import { DisciplineNotifier, IDisciplineObserver } from './patterns/DisciplineNotifier';
import { DisciplineEventArgs } from './patterns/DisciplineEventArgs';
import { DisciplineFactory } from './factories/DisciplineFactory';

class ConsoleLogger implements IDisciplineObserver {
    update(eventArgs: DisciplineEventArgs): void {
        console.log(`[${eventArgs.timestamp.toISOString()}] ${eventArgs.sender}: ${eventArgs.message}`);
    }
}

function main(): void {
    const notifier = new DisciplineNotifier();
    const logger = new ConsoleLogger();
    
    notifier.subscribe(logger);

    const physicsTeacher = new Teacher('Dr. Smith');
    const englishTeacher = new Teacher('Prof. Johnson');
    const mathTeacher = new Teacher('Dr. Brown');

    const physics = DisciplineFactory.createDiscipline('physics', physicsTeacher, notifier);
    const english = DisciplineFactory.createDiscipline('english', englishTeacher, notifier);
    const math = DisciplineFactory.createDiscipline('math', mathTeacher, notifier);

    console.log('=== University Management System Demo ===\n');

    console.log('Activity Requirements:');
    console.log(`Physics: ${physics.getActivityRequirements().join(', ')}`);
    console.log(`English: ${english.getActivityRequirements().join(', ')}`);
    console.log(`Math: ${math.getActivityRequirements().join(', ') || 'None'}\n`);

    const students = [
        new Student('Alice', 'S001'),
        new Student('Bob', 'S002'),
        new Student('Charlie', 'S003'),
        new Student('Diana', 'S004'),
        new Student('Eve', 'S005'),
        new Student('Frank', 'S006'),
        new Student('Grace', 'S007'),
        new Student('Henry', 'S008'),
        new Student('Iris', 'S009'),
        new Student('Jack', 'S010'),
        new Student('Kate', 'S011'),
        new Student('Leo', 'S012'),
        new Student('Maya', 'S013'),
        new Student('Noah', 'S014'),
        new Student('Olivia', 'S015')
    ];

    console.log('=== Physics Enrollment ===');
    students.forEach(student => physics.enrollStudent(student));
    
    console.log('\n=== Attempting to start Physics course ===');
    physics.startCourse();
    
    console.log('\n=== Attempting to enroll another student in Physics (should fail - teacher busy) ===');
    const extraStudent = new Student('Peter', 'S016');
    physics.enrollStudent(extraStudent);

    console.log('\n=== Ending Physics course ===');
    physics.endCourse();

    console.log('\n=== English Enrollment ===');
    students.slice(0, 13).forEach(student => english.enrollStudent(student));
    
    console.log('\n=== Starting English course ===');
    english.startCourse();

    console.log('\n=== Math Enrollment (insufficient students) ===');
    students.slice(0, 10).forEach(student => math.enrollStudent(student));
    
    console.log('\n=== Attempting to start Math course (should fail) ===');
    math.startCourse();

    console.log('\n=== Adding more students to Math ===');
    students.slice(10, 15).forEach(student => math.enrollStudent(student));
    
    console.log('\n=== Starting Math course ===');
    math.startCourse();

    console.log('\n=== Subgroup Creation Test ===');
    console.log(`Physics can create subgroup: ${physics.canCreateSubgroup()}`);
    console.log(`English can create subgroup: ${english.canCreateSubgroup()}`);
    console.log(`Math can create subgroup: ${math.canCreateSubgroup()}`);

    console.log('\n=== Demo Complete ===');
}

main();
