import { getModelByName } from '../nodes/all';
import { UserId } from '../../../shared/all';

interface IUser {
  name: string;
  pictureUrl: string;
  googleId: string;
}
interface IUserProfileGoogle {
  id: string;
  displayName: string;
  photos?: { value: string }[];
}
type UserProfile = IUserProfileGoogle;

const UserModel = getModelByName('User');

export const getUserById = async (userId: UserId): Promise<IUser | boolean> => {
  return await UserModel.findById(userId);
};

export const userCreateOrFetchByProfile = async (userProfile: UserProfile): Promise<IUser> => {
  // We should update profile data here, too.
  const foundUser = await userFetchByProfile(userProfile);
  if (typeof foundUser === 'object' && foundUser !== null) {
    return foundUser;
  }

  const {
    displayName: name,
    photos: [{ value: pictureUrl }],
    id: googleId,
  } = userProfile;
  return await userCreate({
    name,
    pictureUrl,
    googleId,
  });
};

// Retrieves a user by Google OAuth2.0 ID
export const userFetchByProfile = async (userProfile: UserProfile): Promise<IUser | boolean> => {
  const query = { $and: [{ googleId: userProfile.id }, { googleId: { $ne: '' } }] };
  return await UserModel.findOne(query).exec();
};

// Creates a new user
export const userCreate = async (user: IUser): Promise<IUser> => {
  return await new UserModel(user).save();
};
