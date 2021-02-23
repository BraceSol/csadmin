import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Industry extends BaseModel {
    id: string;
    industryId: string;
    industryName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    isActive: number;
    adminId: string;
    industry: any;
}