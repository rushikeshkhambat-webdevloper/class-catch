import {
  storage, databases, ID, Query,
  DATABASE_ID, VIDEOS_TABLE, BUCKET_ID
} from '../../../services/appwrite';

export async function uploadVideo(file, metadata, userId, userName) {
  const fileUpload = await storage.createFile(BUCKET_ID, ID.unique(), file);

  return await databases.createDocument(DATABASE_ID, VIDEOS_TABLE, ID.unique(), {
    title: metadata.title,
    description: metadata.description || '',
    subject: metadata.subject,
    fileId: fileUpload.$id,
    teacherId: userId,
    teacherName: userName,
    date: metadata.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  });
}

export async function getVideos(subject = null) {
  const queries = [Query.orderDesc('createdAt')];
  if (subject) queries.unshift(Query.equal('subject', subject));
  return await databases.listDocuments(DATABASE_ID, VIDEOS_TABLE, queries);
}

export async function getVideoById(id) {
  return await databases.getDocument(DATABASE_ID, VIDEOS_TABLE, id);
}

export function getVideoUrl(fileId) {
  return storage.getFileView(BUCKET_ID, fileId);
}

export async function deleteVideo(documentId, fileId) {
  try { await storage.deleteFile(BUCKET_ID, fileId); } catch {}
  await databases.deleteDocument(DATABASE_ID, VIDEOS_TABLE, documentId);
}