import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Upload extends BaseModel {
    id: string;
    pageDetail: JSON;
    pctComplete: number;
    filename: string;
    statusCode: number;
    createdBy: string;
    updatedBy: string;
    assignedTo: string;
    isActive: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    queueId:string;
    upload: any;
    uploadId: string;
    adminId: string;
}