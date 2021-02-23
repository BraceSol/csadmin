import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerDepartment extends BaseModel {
    id: string;
    employerDepartmentId:string;
    department:any;
    employerId: string;
    adminId:string;
    departmentName: string;
    description: string;
    costCenterCode: string;
    createdBy: string;
    updatedBy: string;
    isActive: number;
}