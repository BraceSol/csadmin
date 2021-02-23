import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CsUser extends BaseModel {
  id: string;
  email: string;
  password: string;
  prefix: string;
  firstName: string;
  middleName: string;
  fullName:string;
  lastName: string;
  suffix: string;
  twoFactorEnabled: number;
  referralCode: string;
  resetToken: string;
  pinCode: number; 
  statusCode: number; 
  googleLoginId: string;
  linkedinLoginId: string;
  facebookLoginId: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
  professionId: string;
  specialtyIds: JSON;
  createdBy: string;
  updatedBy: string;
}