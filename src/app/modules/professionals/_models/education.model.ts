import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EducationHistory extends BaseModel {
    id: string;
    userId: string;
    schoolId: string;
    schoolName: string;
    educationId:string;
    city: string;
    state: string;
    postalCode: string;
    degree: string;
    graduationDate: string;
    startDate: string;
    attending: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: boolean;
    education: any;
    adminId: string;
}