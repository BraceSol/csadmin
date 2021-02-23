import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Employee extends BaseModel {
    id: string;
    employerId: string;
    adminId: string;
    firstName: string;
    lastName: string;
    employerName:string;
    email: string;
    employer:string;
    phoneNumber: string;
    employeeNumber: string;
    startDate: string;
    endDate: string;
    jobTitle: string;
    departmentId: string;
    departmentName: string;
    locationId: string;
    supervisorId: string;
    professionId: string;
    jobType: string;
    agencyId: string;
    agencyRecruiterId: string;
    shift: string;
    jobId: string;
    statusCode: number;
    createdBy: string;
    updatedBy: string;
    isActive: number;
}
