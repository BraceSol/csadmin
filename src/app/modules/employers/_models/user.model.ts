import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerUser extends BaseModel {
    id: string;
    employerId: string;
    userId: string;
    jobTItle: string;
    createdBy: string;
    updatedBy: string;
    isActive: number;
}
