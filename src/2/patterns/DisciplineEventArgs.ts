import { ActivityType } from '../models/Activity';

export enum EventType {
  STUDENT_ENROLLED = 'Student Enrolled',
  STUDENT_REJECTED = 'Student Rejected',
  ACTIVITY_COMPLETED = 'Activity Completed',
  ACTIVITY_SUBMITTED = 'Activity Submitted',
  COURSE_STARTED = 'Course Started',
  COURSE_ENDED = 'Course Ended',
  EXAM_ADMISSION_DENIED = 'Exam Admission Denied',
  EQUIPMENT_UNAVAILABLE = 'Equipment Unavailable',
  CREDIT_AWARDED = 'Credit Awarded',
  BONUS_APPLIED = 'Bonus Applied'
}

export interface ActivityEventData {
  activityType: ActivityType;
  grade?: number;
  hasBonus?: boolean;
}

export interface StudentEventData {
  studentId: string;
  studentName: string;
  reason?: string;
}

export interface EquipmentEventData {
  equipmentType: string;
  activityType: ActivityType;
}

export class DisciplineEventArgs {
  constructor(
    public readonly eventType: EventType,
    public readonly message: string,
    public readonly sender: string,
    public readonly timestamp: Date = new Date(),
    public readonly studentData?: StudentEventData,
    public readonly activityData?: ActivityEventData,
    public readonly equipmentData?: EquipmentEventData
  ) {}
}
