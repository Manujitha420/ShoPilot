export interface StoredUser {
  id: string;
  email: string;
  name: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

// In-memory store for Next.js API routes fallback
const usersStore: Map<string, StoredUser> = new Map();

// Seed standard demo accounts
usersStore.set('emily.johnson@x.dummyjson.com', {
  id: '1',
  email: 'emily.johnson@x.dummyjson.com',
  name: 'Emily Johnson',
  username: 'emilys',
  password: 'emilyspass',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128',
});

usersStore.set('michael.williams@x.dummyjson.com', {
  id: '2',
  email: 'michael.williams@x.dummyjson.com',
  name: 'Michael Williams',
  username: 'michaelw',
  password: 'michaelwpass',
  firstName: 'Michael',
  lastName: 'Williams',
  gender: 'male',
  image: 'https://dummyjson.com/icon/michaelw/128',
});

export const findUserByEmailOrUsername = (identifier: string): StoredUser | undefined => {
  const cleanId = identifier.trim().toLowerCase();
  for (const user of usersStore.values()) {
    if (
      user.email.toLowerCase() === cleanId ||
      user.username.toLowerCase() === cleanId
    ) {
      return user;
    }
  }
  return undefined;
};

export const registerUserInStore = (user: StoredUser): StoredUser => {
  usersStore.set(user.email.toLowerCase(), user);
  return user;
};
