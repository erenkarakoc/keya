export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface UserModel {
  id: string
  uid: string
  email: string
  emailVerified: boolean
  first_name: string
  last_name: string
  fullname?: string
  providerData?: {
    providerId: string
    uid: string
    displayName: string | null
    email: string
    phoneNumber: string | null
    photoURL: string | null
  }[]
  occupation?: string
  phone?: string
  roles?: Array<number>
  pic?: string
  emailSettings?: UserEmailSettingsModel
  address?: UserAddressModel
  createdAt: string
  lastLoginAt: string
}
