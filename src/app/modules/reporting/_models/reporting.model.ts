import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface ComplianceReport extends BaseModel {
    id: string;
    professionId: string;
    expertiseId: string;
    departmentId: string;
    locationId: string;
    startDate: string;
    endDate: string;
    initialScore: number;
    currentScore: number;
    missingDocs: number;
    totalDocs: number;
    expiringDocs: number;
    statusCode: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    isActive: number;
    employerId: string
    userId: string
    complianceReportId:string;
    complianceReport: any;
    adminId: string;
}

