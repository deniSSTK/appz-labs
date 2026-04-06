import { Teacher } from '../models/Teacher';

export interface IValidationStrategy {
    validateEnrollment(
        currentStudents: number,
        teacher: Teacher,
        courseCount: number
    ): { isValid: boolean; message: string };

    getActivityRequirements(): string[];
}

export class PhysicsValidation implements IValidationStrategy {
    validateEnrollment(
        currentStudents: number,
        teacher: Teacher,
        courseCount: number
    ): { isValid: boolean; message: string } {
        if (teacher.isBusy()) {
            return {
                isValid: false,
                message: 'Teacher is busy'
            };
        }

        if (courseCount >= 1) {
            return {
                isValid: false,
                message: 'Physics allows only 1 course'
            };
        }

        if (currentStudents >= 13) {
            return {
                isValid: false,
                message: 'Physics already has maximum students (13)'
            };
        }

        return { isValid: true, message: 'Enrollment valid' };
    }

    getActivityRequirements(): string[] {
        return ['Lab'];
    }
}

export class EnglishValidation implements IValidationStrategy {
    validateEnrollment(
        currentStudents: number,
        teacher: Teacher,
        courseCount: number
    ): { isValid: boolean; message: string } {
        if (teacher.isBusy()) {
            return {
                isValid: false,
                message: 'Teacher is busy'
            };
        }

        if (courseCount >= 2) {
            return {
                isValid: false,
                message: 'English allows maximum 2 courses'
            };
        }

        if (currentStudents >= 13) {
            return {
                isValid: false,
                message: 'English already has maximum students (13)'
            };
        }

        return { isValid: true, message: 'Enrollment valid' };
    }

    getActivityRequirements(): string[] {
        return ['Audio equipment'];
    }
}

export class StandardValidation implements IValidationStrategy {
    validateEnrollment(
        currentStudents: number,
        teacher: Teacher,
        courseCount: number
    ): { isValid: boolean; message: string } {
        if (teacher.isBusy()) {
            return {
                isValid: false,
                message: 'Teacher is busy'
            };
        }

        if (courseCount >= 2) {
            return {
                isValid: false,
                message: 'Standard discipline allows maximum 2 courses'
            };
        }

        if (currentStudents >= 13) {
            return {
                isValid: false,
                message: 'Standard discipline already has maximum students (13)'
            };
        }

        return { isValid: true, message: 'Enrollment valid' };
    }

    getActivityRequirements(): string[] {
        return [];
    }
}
