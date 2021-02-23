import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  id: string;
  state:string;
  licenseNumber:string;
  username: string;
  password: string;  
  confirmPassword:string;
  hasError:boolean;
  deviceName:string;
  deviceCode:string;
  lastLocation:string;
  fullName: string;
  newPassword:string;

  userId:string;
  email: string;
  pic: string;
  roles: number[];
  occupation: string;
  companyName: string;
  phone: string;
  address?: AddressModel;
  socialNetworks?: SocialNetworksModel;
  // personal information
  firstName: string;
  lastName: string;
  twoFactorEnabled:boolean;
 

  website: string;
  profileName:string;
  // account information
  language: string;
  timeZone: string;
  communication: {
    email: boolean,
    sms: boolean,

  
    phone: boolean,

  };
  // email settings
  emailSettings: {
    emailNotification: boolean,
    sendCopyToPersonalEmail: boolean,
    activityRelatesEmail: {
      youHaveNewNotifications: boolean,
      youAreSentADirectMessage: boolean,
      someoneAddsYouAsAsAConnection: boolean,
      uponNewOrder: boolean,
      newMembershipApproval: boolean,
      memberRegistration: boolean
    },
    updatesFromKeenthemes: {
      newsAboutKeenthemesProductsAndFeatureUpdates: boolean,
      tipsOnGettingMoreOutOfKeen: boolean,
      thingsYouMissedSindeYouLastLoggedIntoKeen: boolean,
      newsAboutMetronicOnPartnerProductsAndOtherServices: boolean,
      tipsOnMetronicBusinessProducts: boolean
    }
  };

  setUser(user: any) {
    this.id = user.id;
    
    this.confirmPassword=user.confirmPassword;
    this.newPassword=user.newPassword;
    this.userId = user.userId;
    this.username = user.username || '';
    this.password = user.password || '';
    this.firstName = user.firstName || '';
    this.state=user.state;
    this.fullName = user.fullName || '';
    this.lastName = user.lastName || '';
    this.email = user.email || '';
    this.pic = user.pic || '';
    this.roles = user.roles || [];
    this.occupation = user.occupation || '';
    this.companyName = user.companyName || '';
    this.phone = user.phone || '';
    this.hasError = user.hasError;
    this.address = user.address;
    this.socialNetworks = user.socialNetworks;
   this.licenseNumber=user.licenseNumber
   this.deviceCode=user.deviceCode || '1234567'
   this.deviceName=user.deviceName
   this.profileName= user.profileName ;
   this. lastLocation=user. lastLocation;
   this.twoFactorEnabled=true
  }
}
