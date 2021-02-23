
import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerLocation extends BaseModel {
    id: string;
    employerId: string;
    location:any;
    locationName: string;
    idNumber: string;
    description: string;
    employerLocationId:string;
    addressLine1: string;
    addressLine2: string;
    adminId:string
    addressLine3: string;
    city: string;
    state: string;
    postalCode: string;
    county: string;
    country: string;
    phone: string;
    website: string;
    bedCount: number;
    totalFTE: number;
    createdBy: string;
    updatedBy: string;
    isActive: number;
}
