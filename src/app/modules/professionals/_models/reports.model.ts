import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface ProfessionalReports extends BaseModel {
  id: string;
  userId: string;
  adminId:string;
  employerId: string;
  complianceReportId:string;
  professionId: string;
  specialtyId: string;
  departmentId: string;
  locationId: string;
  report:any;
  initialScore: number;
  currentScore: number;
  missingDocs: number;
  totalDocs: number;
  expiringDocs: number;
  statusCode: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
}