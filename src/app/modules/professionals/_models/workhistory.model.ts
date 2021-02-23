import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface WorkHistory extends BaseModel {
  id: string;
  startDate: string;
  workHistory:any;
  endDate: string;
  currentlyWorking: number;
  employerName: string;
  employerCity: string;
  employerState: string;
  bedsInFacility: number;
  workHistoryId:string;
  bedCount: number;
  employerDepartmentId:string;
  teachingFacility: number;
  traumaFacility: number;
  magnetFacility: number;
  jobTypeCode: string;
  nurseToPatientRatio: string;
  chargeExp: number;
  shift: string;
  referenceName: string;
  referenceTitle: string;
  referenceEmail: string;
  referencePhone: string;
  referenceContact: number;
  reasonForLeaving: string;
  createdBy: string;
  updatedBy: string;
  reference: any;
  isActive: boolean;
  adminId:string;
  userId: string;
  employerId: string;
  professionId: string;
  specialtyId: string;
}