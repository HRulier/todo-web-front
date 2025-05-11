export type UserProfile = {
  firstName: string;
  lastName: string;
};

export interface IUser {
  _id: string;
  email: string;
  profile: UserProfile;
}
