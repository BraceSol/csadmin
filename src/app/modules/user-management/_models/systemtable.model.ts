import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface SystemTable extends BaseModel {
    id: string;
    systemTableId: string;
    tableGroup: string;
    tableName: string;
    optionText: string;
    optionValue: string;
    optionSequence: number;
    createdAt: string;
    updatedAt: string;
    isActive: number;
    adminId: string;
    systemtable: any;
}