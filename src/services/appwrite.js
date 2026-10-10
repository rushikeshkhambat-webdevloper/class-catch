import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export { client, ID, Query };

export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const BUCKET_ID = import.meta.env.VITE_BUCKET_ID;

// Table IDs
export const VIDEOS_TABLE = '6ac76077000d73dd7443';
export const NOTES_TABLE = '6ac799bd000f5d400814';
export const CHATS_TABLE = '6ac91f33003b55aed0b7';
export const MESSAGES_TABLE = '6ac9211100274e8441b2';

// Function IDs
export const SUMMARIZER_FUNCTION_ID = '6ac7adcf0015da2b466b';
export const CHATBOT_FUNCTION_ID = '6ac9236400377cff8e57';