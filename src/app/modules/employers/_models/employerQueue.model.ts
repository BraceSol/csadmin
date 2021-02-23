import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface EmployerQueue extends BaseModel {
    id: string;
    isSystem: boolean;
    title: string;
    description: string;
    queueType: number;
    stats: any;
    ownerId: string;
    statusCode: number;
    createdBy: string;
    updatedBy: string;
    assignedTo: string;
    isActive: number;
    createdAt: string;
    updatedAt: string;
    employerId: string;
    queueId:string;
    queue: any;
    adminId: string;
}