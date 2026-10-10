import {
  functions, databases, ID, Query,
  CHATBOT_FUNCTION_ID, DATABASE_ID, CHATS_TABLE, MESSAGES_TABLE,
} from '../../../services/appwrite';

export async function createChat(userId, userName, firstMessage) {
  const now = new Date().toISOString();
  return await databases.createDocument(DATABASE_ID, CHATS_TABLE, ID.unique(), {
    title: firstMessage.slice(0, 60) + (firstMessage.length > 60 ? '…' : ''),
    userId, userName,
    lastMessage: firstMessage.slice(0, 200),
    messageCount: 0,
    createdAt: now, updatedAt: now,
  });
}

export async function getUserChats(userId) {
  const res = await databases.listDocuments(DATABASE_ID, CHATS_TABLE, [
    Query.equal('userId', userId),
    Query.orderDesc('updatedAt'),
    Query.limit(50),
  ]);
  return res.documents;
}

export async function updateChat(chatId, data) {
  return await databases.updateDocument(DATABASE_ID, CHATS_TABLE, chatId, {
    ...data, updatedAt: new Date().toISOString(),
  });
}

export async function deleteChat(chatId) {
  try {
    const msgs = await databases.listDocuments(DATABASE_ID, MESSAGES_TABLE, [
      Query.equal('chatId', chatId), Query.limit(500),
    ]);
    await Promise.all(
      msgs.documents.map(m => databases.deleteDocument(DATABASE_ID, MESSAGES_TABLE, m.$id))
    );
  } catch (err) { console.warn('Failed to delete messages:', err); }
  return await databases.deleteDocument(DATABASE_ID, CHATS_TABLE, chatId);
}

export async function getChatMessages(chatId) {
  const res = await databases.listDocuments(DATABASE_ID, MESSAGES_TABLE, [
    Query.equal('chatId', chatId),
    Query.orderAsc('createdAt'),
    Query.limit(500),
  ]);
  return res.documents;
}

export async function saveMessage(chatId, role, content) {
  return await databases.createDocument(DATABASE_ID, MESSAGES_TABLE, ID.unique(), {
    chatId, role, content,
    createdAt: new Date().toISOString(),
  });
}

export async function askAI(messages, notes) {
  // Combine content + extractedText for each note
  const formattedNotes = notes.map(n => ({
    title: n.title,
    content: [n.content, n.extractedText].filter(Boolean).join('\n\n'),
  }));

  const execution = await functions.createExecution(
    CHATBOT_FUNCTION_ID,
    JSON.stringify({ messages, notes: formattedNotes }),
    false
  );

  if (execution.status !== 'completed') {
    throw new Error('Function failed: ' + execution.status);
  }

  const response = JSON.parse(execution.responseBody || '{}');
  if (response.error) {
    throw new Error(response.error + (response.details ? ': ' + response.details : ''));
  }
  return response.reply;
}