import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerJob extends BaseModel {

    id: string;
    employerId: string;
    locationId: string;
    jobTItle: string;
    shortDescription: string;
    description: string;
    internalOnly: number;
    startDate: string;
    createdBy: string;
    updatedBy: string;
    isActive: number;

}