import inquirer from 'inquirer';
import { Teacher } from './models/Teacher';
import { Student } from './models/Student';
import { DisciplineNotifier, IDisciplineObserver } from './patterns/DisciplineNotifier';
import { DisciplineEventArgs } from './patterns/DisciplineEventArgs';
import { DisciplineFactory } from './factories/DisciplineFactory';
import { Discipline } from './models/Discipline';

class ConsoleLogger implements IDisciplineObserver {
  update(eventArgs: DisciplineEventArgs): void {
    console.log(`[${eventArgs.timestamp.toISOString()}] ${eventArgs.sender}: ${eventArgs.message}`);
  }
}

class UniversityManagementSystem {
  private readonly notifier: DisciplineNotifier;
  private readonly logger: ConsoleLogger;
  private teachers: Teacher[] = [];
  private students: Student[] = [];
  private disciplines: Discipline[] = [];

  constructor() {
    this.notifier = new DisciplineNotifier();
    this.logger = new ConsoleLogger();
    this.notifier.subscribe(this.logger);

    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    this.teachers = [
      new Teacher('Dr. Smith'),
      new Teacher('Prof. Johnson'),
      new Teacher('Dr. Brown')
    ];

    this.students = [
      new Student('Alice'),
      new Student('Bob'),
      new Student('Charlie'),
      new Student('Diana'),
      new Student('Eve'),
      new Student('Frank'),
      new Student('Grace'),
      new Student('Henry'),
      new Student('Iris'),
      new Student('Jack'),
      new Student('Kate'),
      new Student('Leo'),
      new Student('Maya'),
      new Student('Noah'),
      new Student('Olivia')
    ];

    this.disciplines = [
      DisciplineFactory.createDiscipline('physics', this.teachers[0], this.notifier),
      DisciplineFactory.createDiscipline('english', this.teachers[1], this.notifier),
      DisciplineFactory.createDiscipline('math', this.teachers[2], this.notifier)
    ];
  }

  async showMainMenu(): Promise<void> {
    while (true) {
      console.log('\n=== University Management System ===');
      console.log('1. View System Status');
      console.log('2. Manage Students');
      console.log('3. Manage Teachers');
      console.log('4. Manage Disciplines');
      console.log('5. View Notifications');
      console.log('6. Exit');

      const { choice } = await inquirer.prompt([
        {
          type: 'input',
          name: 'choice',
          message: 'Enter your choice (1-6):',
          validate: (input) => {
            const num = parseInt(input);
            if (isNaN(num) || num < 1 || num > 6) {
              return 'Please enter a number between 1 and 6';
            }
            return true;
          }
        }
      ]);

      const choiceNum = parseInt(choice);

      if (choiceNum === 6) {
        console.log('\nGoodbye!');
        break;
      }

      const actionMap: { [key: number]: string } = {
        1: 'status',
        2: 'students',
        3: 'teachers',
        4: 'disciplines',
        5: 'notifications'
      };

      await this.handleMenuAction(actionMap[choiceNum]);
    }
  }

  private async handleMenuAction(action: string): Promise<void> {
    switch (action) {
      case 'status':
        await this.showSystemStatus();
        break;
      case 'students':
        await this.manageStudents();
        break;
      case 'teachers':
        await this.manageTeachers();
        break;
      case 'disciplines':
        await this.manageDisciplines();
        break;
      case 'notifications':
        await this.viewNotifications();
        break;
    }
  }

  private async showSystemStatus(): Promise<void> {
    console.log('\n=== System Status ===\n');

    console.log(`Teachers: ${this.teachers.length}`);
    this.teachers.forEach((teacher, index) => {
      const status = teacher.isBusy() ? 'Busy' : 'Available';
      console.log(`  ${index + 1}. ${teacher.getName()} - ${status}`);
    });

    console.log(`\nStudents: ${this.students.length}`);
    this.students.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.getName()} (${student.getId()})`);
    });

    console.log(`\nDisciplines: ${this.disciplines.length}`);
    this.disciplines.forEach((discipline, index) => {
      const status =
        discipline.getStudentCount() > 0 && discipline.getTeacher().isBusy()
          ? 'Active'
          : 'Inactive';
      console.log(`  ${index + 1}. ${discipline.getName()} - ${status}`);
      console.log(`     Teacher: ${discipline.getTeacher().getName()}`);
      console.log(`     Enrolled: ${discipline.getStudentCount()}/13`);
      console.log(
        `     Requirements: ${discipline.getActivityRequirements().join(', ') || 'None'}`
      );
    });
  }

  private async manageStudents(): Promise<void> {
    while (true) {
      console.log('\n=== Student Management ===');
      console.log('1. List All Students');
      console.log('2. Add New Student');
      console.log('3. Find Student');
      console.log('4. Back to Main Menu');

      const { choice } = await inquirer.prompt([
        {
          type: 'input',
          name: 'choice',
          message: 'Enter your choice (1-4):',
          validate: (input) => {
            const num = parseInt(input);
            if (isNaN(num) || num < 1 || num > 4) {
              return 'Please enter a number between 1 and 4';
            }
            return true;
          }
        }
      ]);

      const choiceNum = parseInt(choice);

      if (choiceNum === 4) break;

      switch (choiceNum) {
        case 1:
          await this.listStudents();
          break;
        case 2:
          await this.addStudent();
          break;
        case 3:
          await this.findStudent();
          break;
      }
    }
  }

  private async listStudents(): Promise<void> {
    console.log('\n=== All Students ===\n');

    if (this.students.length === 0) {
      console.log('No students found.');
    } else {
      this.students.forEach((student, index) => {
        const enrollments = this.disciplines
          .filter((d) => d.isStudentEnrolled(student.getId()))
          .map((d) => d.getName());

        console.log(`${index + 1}. ${student.getName()} (${student.getId()})`);
        console.log(`   Enrolled in: ${enrollments.length > 0 ? enrollments.join(', ') : 'None'}`);
      });
    }
  }

  private async addStudent(): Promise<void> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter student name:',
        validate: (input) => input.trim() !== '' || 'Name is required'
      }
    ]);

    const newStudent = new Student(name);
    this.students.push(newStudent);

    console.log(`\nStudent ${newStudent.getName()} (${newStudent.getId()}) added successfully!`);
  }

  private async findStudent(): Promise<void> {
    console.log('\n=== Find Student ===');
    console.log('1. Search by Name');
    console.log('2. Search by Student ID');

    const { choice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'choice',
        message: 'Enter your choice (1-2):',
        validate: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > 2) {
            return 'Please enter a number between 1 and 2';
          }
          return true;
        }
      }
    ]);

    const choiceNum = parseInt(choice);
    const searchType = choiceNum === 1 ? 'name' : 'id';
    let searchQuery: string;
    let searchPrompt = searchType === 'name' ? 'Enter student name:' : 'Enter student ID:';

    const { query } = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
        message: searchPrompt,
        validate: (input) => input.trim() !== '' || 'Search query is required'
      }
    ]);

    searchQuery = query.trim();

    const foundStudents = this.students.filter((student) => {
      if (searchType === 'name') {
        return student.getName().toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return student.getId().toLowerCase().includes(searchQuery.toLowerCase());
      }
    });

    console.log(`\n=== Search Results (${foundStudents.length} found) ===\n`);

    if (foundStudents.length === 0) {
      console.log('No students found matching your search.');
    } else {
      foundStudents.forEach((student, index) => {
        const enrollments = this.disciplines
          .filter((d) => d.isStudentEnrolled(student.getId()))
          .map((d) => d.getName());

        console.log(`${index + 1}. ${student.getName()} (${student.getId()})`);
        console.log(
          `   Enrolled in: ${enrollments.length > 0 ? enrollments.join(', ') : 'None'}`
        );
      });
    }
  }

  private async manageTeachers(): Promise<void> {
    while (true) {
      console.log('\n=== Teacher Management ===');
      console.log('1. List All Teachers');
      console.log('2. Add New Teacher');
      console.log('3. Back to Main Menu');

      const { choice } = await inquirer.prompt([
        {
          type: 'input',
          name: 'choice',
          message: 'Enter your choice (1-3):',
          validate: (input) => {
            const num = parseInt(input);
            if (isNaN(num) || num < 1 || num > 3) {
              return 'Please enter a number between 1 and 3';
            }
            return true;
          }
        }
      ]);

      const choiceNum = parseInt(choice);

      if (choiceNum === 3) break;

      switch (choiceNum) {
        case 1:
          await this.listTeachers();
          break;
        case 2:
          await this.addTeacher();
          break;
      }
    }
  }

  private async listTeachers(): Promise<void> {
    console.log('\n=== All Teachers ===\n');

    if (this.teachers.length === 0) {
      console.log('No teachers found.');
    } else {
      this.teachers.forEach((teacher, index) => {
        const status = teacher.isBusy() ? 'Busy' : 'Available';
        const disciplines = this.disciplines.filter(
          (d) => d.getTeacher().getName() === teacher.getName()
        );

        console.log(`${index + 1}. ${teacher.getName()} - ${status}`);
        console.log(`   Teaches: ${disciplines.map((d) => d.getName()).join(', ') || 'None'}`);
      });
    }
  }

  private async addTeacher(): Promise<void> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter teacher name:',
        validate: (input) => {
          const trimmed = input.trim();
          if (trimmed === '') return 'Name is required';
          if (this.teachers.some((t) => t.getName() === trimmed)) {
            return 'Teacher with this name already exists';
          }
          return true;
        }
      }
    ]);

    const newTeacher = new Teacher(name);
    this.teachers.push(newTeacher);

    console.log(`\nTeacher ${newTeacher.getName()} added successfully!`);
  }

  private async manageDisciplines(): Promise<void> {
    while (true) {
      console.log('\n=== Discipline Management ===');
      console.log('1. List All Disciplines');
      console.log('2. Create New Discipline');
      console.log('3. Enroll Students');
      console.log('4. Start Course');
      console.log('5. End Course');
      console.log('6. Back to Main Menu');

      const { choice } = await inquirer.prompt([
        {
          type: 'input',
          name: 'choice',
          message: 'Enter your choice (1-6):',
          validate: (input) => {
            const num = parseInt(input);
            if (isNaN(num) || num < 1 || num > 6) {
              return 'Please enter a number between 1 and 6';
            }
            return true;
          }
        }
      ]);

      const choiceNum = parseInt(choice);

      if (choiceNum === 6) break;

      switch (choiceNum) {
        case 1:
          await this.listDisciplines();
          break;
        case 2:
          await this.createDiscipline();
          break;
        case 3:
          await this.enrollStudents();
          break;
        case 4:
          await this.startCourse();
          break;
        case 5:
          await this.endCourse();
          break;
      }
    }
  }

  private async listDisciplines(): Promise<void> {
    console.log('\n=== All Disciplines ===\n');

    if (this.disciplines.length === 0) {
      console.log('No disciplines found.');
    } else {
      this.disciplines.forEach((discipline, index) => {
        const status = discipline.getTeacher().isBusy() ? 'Active' : 'Inactive';

        console.log(`${index + 1}. ${discipline.getName()} - ${status}`);
        console.log(`   Teacher: ${discipline.getTeacher().getName()}`);
        console.log(`   Enrolled: ${discipline.getStudentCount()}/13`);
        console.log(
          `   Requirements: ${discipline.getActivityRequirements().join(', ') || 'None'}`
        );
        console.log(`   Can create subgroup: ${discipline.canCreateSubgroup() ? 'Yes' : 'No'}`);

        if (discipline.getStudentCount() > 0) {
          console.log(`   Note: ${discipline.getStudentCount()} students enrolled`);
        }
        console.log('');
      });
    }
  }

  private async createDiscipline(): Promise<void> {
    if (this.teachers.length === 0) {
      console.log('\nNo teachers available. Please add a teacher first.');
      return;
    }

    const { teacherName, type } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter discipline name:',
        validate: (input) => {
          const trimmed = input.trim();
          if (trimmed === '') return 'Discipline name is required';
          if (this.disciplines.some((d) => d.getName().toLowerCase() === trimmed.toLowerCase())) {
            return 'Discipline with this name already exists';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'teacherName',
        message: 'Select teacher:',
        choices: this.teachers.map((t) => ({ name: t.getName(), value: t.getName() }))
      },
      {
        type: 'list',
        name: 'type',
        message: 'Select discipline type:',
        choices: [
          { name: 'Physics', value: 'physics' },
          { name: 'English', value: 'english' },
          { name: 'Math', value: 'math' }
        ]
      }
    ]);

    const selectedTeacher = this.teachers.find((t) => t.getName() === teacherName)!;
    const newDiscipline = DisciplineFactory.createDiscipline(type, selectedTeacher, this.notifier);

    this.disciplines.push(newDiscipline);

    console.log(`\nDiscipline ${newDiscipline.getName()} created successfully!`);
    console.log(`Requirements: ${newDiscipline.getActivityRequirements().join(', ') || 'None'}`);
  }

  private async enrollStudents(): Promise<void> {
    if (this.disciplines.length === 0) {
      console.log('\nNo disciplines available. Please create a discipline first.');
      return;
    }

    if (this.students.length === 0) {
      console.log('\nNo students available. Please add a student first.');
      return;
    }

    const { disciplineName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'disciplineName',
        message: 'Select discipline:',
        choices: this.disciplines.map((d) => ({
          name: `${d.getName()} (${d.getStudentCount()}/13 enrolled)`,
          value: d.getName()
        }))
      }
    ]);

    const discipline = this.disciplines.find((d) => d.getName() === disciplineName)!;
    const availableStudents = this.students.filter((s) => !discipline.isStudentEnrolled(s.getId()));

    if (availableStudents.length === 0) {
      console.log(
        '\nNo available students to enroll. All students are already enrolled in this discipline.'
      );
      return;
    }

    const { selectedStudents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedStudents',
        message: 'Select students to enroll:',
        choices: availableStudents.map((s) => ({
          name: `${s.getName()} (${s.getId()})`,
          value: s.getId()
        }))
      }
    ]);

    if (selectedStudents.length === 0) {
      console.log('\nNo students selected.');
    } else {
      selectedStudents.forEach((studentId: string) => {
        const student = this.students.find((s) => s.getId() === studentId)!;
        discipline.enrollStudent(student);
      });

      console.log(`\n${selectedStudents.length} student(s) enrolled successfully!`);
      console.log(`Total enrolled: ${discipline.getStudentCount()}/13`);
    }
  }

  private async startCourse(): Promise<void> {
    if (this.disciplines.length === 0) {
      console.log('\nNo disciplines available.');
      return;
    }

    const availableDisciplines = this.disciplines.filter((d) => !d.getTeacher().isBusy());

    if (availableDisciplines.length === 0) {
      console.log('\nNo inactive disciplines available to start.');
      return;
    }

    const { disciplineName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'disciplineName',
        message: 'Select discipline to start:',
        choices: availableDisciplines.map((d) => ({
          name: `${d.getName()} (${d.getStudentCount()}/13 enrolled)`,
          value: d.getName()
        }))
      }
    ]);

    const discipline = this.disciplines.find((d) => d.getName() === disciplineName)!;

    try {
      const success = discipline.startCourse();
      if (success) {
        console.log(`\nCourse ${discipline.getName()} started successfully!`);
      } else {
        console.log(
          `\nFailed to start course. Check requirements (need 13 students, available teacher).`
        );
      }
    } catch (error) {
      console.log(`\nFailed to start course: ${(error as Error).message}`);
    }
  }

  private async endCourse(): Promise<void> {
    if (this.disciplines.length === 0) {
      console.log('\nNo disciplines available.');
      return;
    }

    const activeDisciplines = this.disciplines.filter((d) => d.getTeacher().isBusy());

    if (activeDisciplines.length === 0) {
      console.log('\nNo active disciplines available to end.');
      return;
    }

    const { disciplineName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'disciplineName',
        message: 'Select discipline to end:',
        choices: activeDisciplines.map((d) => ({
          name: `${d.getName()} (${d.getStudentCount()} students)`,
          value: d.getName()
        }))
      }
    ]);

    const discipline = this.disciplines.find((d) => d.getName() === disciplineName)!;
    discipline.endCourse();

    console.log(`\nCourse ${discipline.getName()} ended successfully!`);
  }

  private async viewNotifications(): Promise<void> {
    console.log('\n=== Recent Notifications ===\n');
    console.log('Notification log is displayed in real-time as events occur.');
    console.log('Check the console output above for recent system events.');
  }
}

async function main(): Promise<void> {
  console.clear();
  console.log('=== University Management System ===\n');
  console.log('Welcome to the interactive university management console!\n');

  const system = new UniversityManagementSystem();
  await system.showMainMenu();
}

main().catch(console.error);
