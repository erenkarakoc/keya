import { Response } from "../../../../../../_metronic/helpers"

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
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

export type User = {
  id: string
  uid: string
  email: string
  emailVerified: boolean
  first_name: string
  last_name: string
  photoURL?: string | null
  phoneNumber?: string
  role?: string
  permissions?: Array<number>
  emailSettings?: UserEmailSettingsModel
  address?: UserAddressModel
  createdAt: string
  lastLoginAt: string
}

export const initialUser: User = {
  id: "0",
  uid: "0",
  email: "test@mail.com",
  emailVerified: false,
  first_name: "Test",
  last_name: "User",
  photoURL: "/media/avatars/blank.png",
  phoneNumber: "",
  role: "",
  permissions: [1, 2],
  emailSettings: {
    emailNotification: true,
    sendCopyToPersonalEmail: false,
    activityRelatesEmail: {
      youHaveNewNotifications: true,
      youAreSentADirectMessage: true,
      someoneAddsYouAsAsAConnection: true,
      uponNewOrder: false,
      newMembershipApproval: true,
      memberRegistration: false,
    },
  },
  address: {
    addressLine: "",
    city: "",
    state: "",
    postCode: "",
  },
  createdAt: "",
  lastLoginAt: "",
}

export type UsersQueryResponse = Response<Array<User>>
