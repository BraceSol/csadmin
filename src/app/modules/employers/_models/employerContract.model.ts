import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerContract extends BaseModel {
    id: string;
    employerId: string;
    adminId:string;
    employerContractId:string;
    agencyId: string;
    startDate: string;
    endDate: string;
    professionIds: JSON;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    employerContact: string;
    agencyContact: string;
    createdBy: string;
    updatedBy: string;
    isActive: number;
}