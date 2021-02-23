import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface ActivityLog extends BaseModel {
    id: string;
    entityId: string;
    entityType: string;
    activityCategory: string;
    activityTitle: string;
    description: string;
    ipAddress: string;
    isActive: number;
    createdAt: string;
    updatedAt: string;
}