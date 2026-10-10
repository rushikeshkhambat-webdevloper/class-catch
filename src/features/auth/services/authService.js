import { account, ID } from '../../../services/appwrite';

export async function login(email, password) {
  return await account.createEmailPasswordSession(email, password);
}

export async function register(email, password, name, role) {
  const user = await account.create(ID.unique(), email, password, name);
  await account.createEmailPasswordSession(email, password);
  await account.updatePrefs({ role });
  return user;
}

export async function logout() {
  return await account.deleteSession('current');
}