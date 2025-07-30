export type UserProfile = {
  firstName: string;
  lastName: string;
};

export interface IUser {
  _id: string;
  email: string;
  dailyEmailReminder: boolean;
  profile: UserProfile;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
