import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerAudit extends BaseModel {
    id: string;
    employerId: string;
    title: string;
    purpose: string;
    description: string;
    isRandom: number;
    employeeCount: number;
    employeeFilter: JSON;
    startDate: string;
    completeDate: string;
    initialScore: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    isActive: number;
    adminId: string;
    employerAuditId: string;
    audit: any;
}