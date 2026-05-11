import { Teacher } from './Teacher';
import { Student } from './Student';
import { IValidationStrategy } from '../strategies/ValidationStrategies';
import { DisciplineNotifier } from '../patterns/DisciplineNotifier';
import { Activity, ActivityType } from './Activity';
import { Group } from './Group';
import { EquipmentRegistry, EquipmentType } from './Equipment';

export abstract class Discipline {
  protected students: Student[] = [];
  protected courseCount: number = 0;
  protected activities: Activity[] = [];
  protected group: Group;
  protected equipmentRegistry: EquipmentRegistry;

  protected constructor(
    protected readonly name: string,
    protected readonly teacher: Teacher,
    protected readonly validationStrategy: IValidationStrategy,
    protected readonly notifier: DisciplineNotifier,
    group: Group
  ) {
    this.group = group;
    this.equipmentRegistry = EquipmentRegistry.getInstance();
    this.initializeActivities();
  }

  public getName(): string {
    return this.name;
  }

  public getTeacher(): Teacher {
    return this.teacher;
  }

  public getStudentCount(): number {
    return this.students.length;
  }

  public isStudentEnrolled(studentId: string): boolean {
    return this.students.some((student) => student.getId() === studentId);
  }

  public getActivityRequirements(): string[] {
    return this.validationStrategy.getActivityRequirements();
  }

  public enrollStudent(student: Student): boolean {
    if (!this.group.canStudyDiscipline(this.name)) {
      this.notifier.notifyStudentRejected(
        student.getName(),
        student.getId(),
        `Group year ${this.group.getYear()} cannot study ${this.name}`,
        this.name
      );
      return false;
    }

    const validation = this.validationStrategy.validateEnrollment(
      this.students.length,
      this.teacher,
      this.courseCount
    );

    if (!validation.isValid) {
      this.notifier.notifyStudentRejected(
        student.getName(),
        student.getId(),
        validation.message,
        this.name
      );
      return false;
    }

    this.students.push(student);
    this.notifier.notifyStudentEnrolled(student.getName(), student.getId(), this.name);
    return true;
  }

  public startCourse(): boolean {
    if (this.students.length < 13) {
      this.notifier.notifyStudentRejected(
        'System',
        'SYSTEM',
        `Insufficient students (${this.students.length}/13)`,
        this.name
      );
      return false;
    }

    if (this.teacher.isBusy()) {
      this.notifier.notifyStudentRejected(
        'System',
        'SYSTEM',
        `Teacher ${this.teacher.getName()} is busy`,
        this.name
      );
      return false;
    }

    this.teacher.lock();
    this.courseCount++;
    this.notifier.notifyCourseStarted(this.name, this.students.length);
    return true;
  }

  public endCourse(): void {
    this.teacher.unlock();
    this.notifier.notifyCourseEnded(this.name);
  }

  public canCreateSubgroup(): boolean {
    return this.students.length >= 10;
  }

  protected abstract initializeActivities(): void;

  public getActivities(): Activity[] {
    return this.activities;
  }

  public completeActivity(studentId: string, activityType: ActivityType, grade?: number): boolean {
    const activity = this.activities.find((a) => a.type === activityType);
    if (!activity) {
      this.notifier.notifyStudentRejected(
        'System',
        'SYSTEM',
        `Activity type ${activityType} not found in ${this.name}`,
        this.name
      );
      return false;
    }

    if (activity.isCompleted) {
      this.notifier.notifyStudentRejected(
        studentId,
        studentId,
        `Activity ${activityType} already completed`,
        this.name
      );
      return false;
    }

    if (!this.checkEquipmentRequirements(activityType)) {
      const equipmentType = this.getRequiredEquipment(activityType);
      this.notifier.notifyEquipmentUnavailable(equipmentType, activityType, this.name);
      return false;
    }

    if (
      (activityType === ActivityType.EXAM || activityType === ActivityType.MODULAR_TEST) &&
      !this.checkExamPrerequisites()
    ) {
      this.notifier.notifyExamAdmissionDenied(
        studentId,
        studentId,
        activityType,
        'Prerequisites not met',
        this.name
      );
      return false;
    }

    const originalGrade = grade;
    activity.complete(grade);

    if (activityType === ActivityType.CREDIT) {
      activity.submit();
      this.notifier.notifyCreditAwarded(studentId, studentId, this.name);
    }

    const bonusEquipment = this.equipmentRegistry.getAvailableBonusEquipment();
    let finalGrade = grade;
    let hasBonus = false;
    if (bonusEquipment.length > 0 && grade) {
      finalGrade = Math.min(grade + 1, 100);
      activity.grade = finalGrade;
      hasBonus = true;
      this.notifier.notifyBonusApplied(
        studentId,
        studentId,
        activityType,
        originalGrade!,
        finalGrade,
        this.name
      );
    }

    this.notifier.notifyActivityCompleted(
      studentId,
      studentId,
      activityType,
      this.name,
      finalGrade,
      hasBonus
    );
    return true;
  }

  public submitActivity(studentId: string, activityType: ActivityType): boolean {
    const activity = this.activities.find((a) => a.type === activityType);
    if (!activity) {
      this.notifier.notifyStudentRejected(
        'System',
        'SYSTEM',
        `Activity type ${activityType} not found in ${this.name}`,
        this.name
      );
      return false;
    }

    if (!activity.isCompleted) {
      this.notifier.notifyStudentRejected(
        studentId,
        studentId,
        `Cannot submit incomplete activity ${activityType}`,
        this.name
      );
      return false;
    }

    activity.submit();
    this.notifier.notifyActivitySubmitted(studentId, studentId, activityType, this.name);
    return true;
  }

  protected getRequiredEquipment(activityType: ActivityType): string {
    switch (activityType) {
      case ActivityType.LABORATORY:
        return 'Laboratory';
      default:
        return 'None';
    }
  }

  protected checkEquipmentRequirements(activityType: ActivityType): boolean {
    switch (activityType) {
      case ActivityType.LABORATORY:
        return this.equipmentRegistry.isEquipmentAvailable(EquipmentType.LABORATORY);
      default:
        return true;
    }
  }

  protected checkExamPrerequisites(): boolean {
    const requiredActivities = this.activities.filter(
      (a) =>
        a.type !== ActivityType.EXAM &&
        a.type !== ActivityType.MODULAR_TEST &&
        a.type !== ActivityType.CREDIT
    );

    return requiredActivities.every((activity) => activity.isCompleted && activity.isSubmitted);
  }

  public getStudentProgress(): { [key in ActivityType]?: string } {
    const progress: { [key in ActivityType]?: string } = {};

    this.activities.forEach((activity) => {
      progress[activity.type] = activity.getStatus();
    });

    return progress;
  }

  public canTakeExam(): boolean {
    return this.checkExamPrerequisites();
  }
}
