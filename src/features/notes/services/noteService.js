import {
  databases, storage, functions, ID, Query,
  DATABASE_ID, NOTES_TABLE, BUCKET_ID, CHATBOT_FUNCTION_ID
} from '../../../services/appwrite';

async function extractTextFromFile(fileId, fileName, fileType) {
  try {
    const execution = await functions.createExecution(
      CHATBOT_FUNCTION_ID,
      JSON.stringify({ fileId, bucketId: BUCKET_ID, fileName, fileType }),
      false,
      '/extract',
      'POST'
    );

    if (execution.status !== 'completed') {
      return '';
    }

    const response = JSON.parse(execution.responseBody || '{}');
    if (response.error) {
      console.warn('Extraction warning:', response.error);
      return '';
    }
    return response.text || '';
  } catch (err) {
    console.warn('Extraction failed:', err.message);
    return '';
  }
}

export async function createNote(data, studentId, studentName) {
  let fileId = '', fileName = '', fileType = '', fileSize = 0;
  let extractedText = '';

  if (data.file?.[0]) {
    const file = data.file[0];
    if (file.size > 50 * 1024 * 1024) throw new Error('File exceeds 50 MB');

    const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
    fileId = uploaded.$id;
    fileName = file.name;
    fileType = file.type;
    fileSize = file.size;

    // Extract text from supported file types
    extractedText = await extractTextFromFile(fileId, fileName, fileType);
  }

  if (!data.content && !fileId) throw new Error('Add text or attach a file');

  return await databases.createDocument(DATABASE_ID, NOTES_TABLE, ID.unique(), {
    title: data.title || '',
    content: data.content || '',
    videoId: data.videoId || '',
    studentId,
    studentName,
    upvotes: 0,
    upvotedBy: '',
    fileId, fileName, fileType, fileSize,
    extractedText,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

export async function getAllNotes() {
  return await databases.listDocuments(DATABASE_ID, NOTES_TABLE, [
    Query.orderDesc('createdAt'), Query.limit(100)
  ]);
}

export async function getNotesForVideo(videoId) {
  return await databases.listDocuments(DATABASE_ID, NOTES_TABLE, [
    Query.equal('videoId', videoId),
    Query.orderDesc('createdAt'), Query.limit(100)
  ]);
}

export async function deleteNote(note) {
  if (note.fileId) {
    try { await storage.deleteFile(BUCKET_ID, note.fileId); } catch {}
  }
  return await databases.deleteDocument(DATABASE_ID, NOTES_TABLE, note.$id);
}

export async function toggleUpvote(note, userId) {
  const list = note.upvotedBy ? note.upvotedBy.split(',').filter(Boolean) : [];
  const has = list.includes(userId);
  const newList = has ? list.filter(id => id !== userId) : [...list, userId];
  const newCount = Math.max(0, (note.upvotes || 0) + (has ? -1 : 1));

  return await databases.updateDocument(DATABASE_ID, NOTES_TABLE, note.$id, {
    upvotes: newCount,
    upvotedBy: newList.join(','),
    updatedAt: new Date().toISOString()
  });
}

export function getNoteFileUrl(fileId) {
  return storage.getFileView(BUCKET_ID, fileId);
}