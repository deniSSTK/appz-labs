import { DisciplineEventArgs, EventType } from './DisciplineEventArgs';
import { ActivityType } from '../models/Activity';

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

  public notifyStudentEnrolled(
    studentName: string,
    studentId: string,
    disciplineName: string
  ): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.STUDENT_ENROLLED,
      `Successfully enrolled ${studentName} in ${disciplineName}`,
      disciplineName,
      new Date(),
      { studentId, studentName }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyStudentRejected(
    studentName: string,
    studentId: string,
    reason: string,
    disciplineName: string
  ): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.STUDENT_REJECTED,
      `Failed to enroll ${studentName}: ${reason}`,
      disciplineName,
      new Date(),
      { studentId, studentName, reason }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyActivityCompleted(
    studentName: string,
    studentId: string,
    activityType: ActivityType,
    disciplineName: string,
    grade?: number,
    hasBonus?: boolean
  ): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.ACTIVITY_COMPLETED,
      `${studentName} completed ${activityType} in ${disciplineName}`,
      disciplineName,
      new Date(),
      { studentId, studentName },
      { activityType, grade, hasBonus }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyActivitySubmitted(
    studentName: string,
    studentId: string,
    activityType: ActivityType,
    disciplineName: string
  ): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.ACTIVITY_SUBMITTED,
      `${studentName} submitted ${activityType} in ${disciplineName}`,
      disciplineName,
      new Date(),
      { studentId, studentName },
      { activityType }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyExamAdmissionDenied(
    studentName: string,
    studentId: string,
    activityType: ActivityType,
    reason: string,
    disciplineName: string
  ): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.EXAM_ADMISSION_DENIED,
      `Cannot take ${activityType}: ${reason}`,
      disciplineName,
      new Date(),
      { studentId, studentName, reason },
      { activityType }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyEquipmentUnavailable(
    equipmentType: string,
    activityType: ActivityType,
    disciplineName: string
  ): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.EQUIPMENT_UNAVAILABLE,
      `Cannot complete ${activityType}: Required ${equipmentType} not available`,
      disciplineName,
      new Date(),
      undefined,
      undefined,
      { equipmentType, activityType }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyCreditAwarded(studentName: string, studentId: string, disciplineName: string): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.CREDIT_AWARDED,
      `${studentName} automatically received credit for ${disciplineName}`,
      disciplineName,
      new Date(),
      { studentId, studentName }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyBonusApplied(
    studentName: string,
    studentId: string,
    activityType: ActivityType,
    originalGrade: number,
    bonusGrade: number,
    disciplineName: string
  ): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.BONUS_APPLIED,
      `${studentName} received bonus grade (${bonusGrade}) for ${activityType}`,
      disciplineName,
      new Date(),
      { studentId, studentName },
      { activityType, grade: bonusGrade, hasBonus: true }
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyCourseStarted(disciplineName: string, studentCount: number): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.COURSE_STARTED,
      `Course ${disciplineName} started with ${studentCount} students`,
      disciplineName
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notifyCourseEnded(disciplineName: string): void {
    const eventArgs = new DisciplineEventArgs(
      EventType.COURSE_ENDED,
      `Course ${disciplineName} ended`,
      disciplineName
    );
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public notify(message: string, sender: string): void {
    const eventArgs = new DisciplineEventArgs(EventType.COURSE_STARTED, message, sender);
    this.observers.forEach((observer) => observer.update(eventArgs));
  }

  public getObserverCount(): number {
    return this.observers.size;
  }
}
