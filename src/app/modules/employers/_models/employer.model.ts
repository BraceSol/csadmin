import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Employer extends BaseModel {
  id: string;
  employerTypeId: string;
  employerName: string;
  cmsCertificationId: string;
  phoneNumber: string;
  adminId:string;
  employerId:string;
  website: string;
  facilityType: string;
  typeOfControl: string;
  traumaLevel: string;
  totalBeds: number;
  totalEmployees: number;
  travelEmployees: number;
  perdiemEmployees: number;
  teachingFacility: number;
  joinCommissionStatus: string;
  jointCommissionDate: string;
  addressLine1: string;
  addressLine2: string;
  createdBy: string;
  updatedBy: string;
  isActive: number;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
}