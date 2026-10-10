import { useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllNotes } from '../features/notes/services/noteService';
import {
  createChat, getUserChats, updateChat, deleteChat,
  getChatMessages, saveMessage, askAI,
} from '../features/ai/services/chatService';

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [notesContext, setNotesContext] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    getUserChats(user.$id).then(setChats).finally(() => setLoadingChats(false));
  }, [user]);

  useEffect(() => {
    getAllNotes().then(res => setNotesContext(res.documents)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeChatId) { setMessages([]); return; }
    getChatMessages(activeChatId).then(setMessages);
  }, [activeChatId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  async function handleSend() {
    const text = input.trim();
    if (!text || thinking) return;
    setInput('');

    let chatId = activeChatId;
    let isNewChat = false;

    if (!chatId) {
      const newChat = await createChat(user.$id, user.name, text);
      chatId = newChat.$id;
      setActiveChatId(chatId);
      setChats([newChat, ...chats]);
      isNewChat = true;
    }

    const userMsg = await saveMessage(chatId, 'user', text);
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    setThinking(true);
    try {
      const history = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await askAI(history, notesContext);
      const aiMsg = await saveMessage(chatId, 'assistant', reply);
      setMessages([...newMessages, aiMsg]);

      const updated = await updateChat(chatId, {
        lastMessage: reply.slice(0, 200),
        messageCount: newMessages.length + 1,
        ...(isNewChat && { title: text.slice(0, 60) + (text.length > 60 ? '…' : '') }),
      });
      setChats(prev => prev.map(c => (c.$id === chatId ? { ...c, ...updated } : c)));
    } catch (err) {
      const errorMsg = await saveMessage(chatId, 'assistant', `⚠️ Sorry, something went wrong: ${err.message}`);
      setMessages([...newMessages, errorMsg]);
    } finally {
      setThinking(false);
    }
  }

  function handleNewChat() {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
    setDrawerOpen(false);
  }

  async function handleDeleteChat(chatId) {
    if (!confirm('Delete this conversation?')) return;
    await deleteChat(chatId);
    setChats(chats.filter(c => c.$id !== chatId));
    if (activeChatId === chatId) handleNewChat();
  }

  function handleSelectChat(chatId) {
    setActiveChatId(chatId);
    setDrawerOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const ChatList = () => (
    <>
      <div style={{ padding: 12 }}>
        <button
          onClick={handleNewChat}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            padding: '10px 14px',
            background: 'var(--accent)',
            color: 'white',
            fontSize: 13
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          <span>New chat</span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 12px' }}>
        {loadingChats ? (
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', padding: '8px 12px' }}>Loading...</p>
        ) : chats.length === 0 ? (
          <p style={{
            fontSize: 12.5,
            color: 'var(--text-tertiary)',
            padding: '16px 12px',
            textAlign: 'center',
            lineHeight: 1.5
          }}>
            No conversations yet. Start one!
          </p>
        ) : (
          chats.map(chat => (
            <div
              key={chat.$id}
              onClick={() => handleSelectChat(chat.$id)}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 2,
                background: activeChatId === chat.$id ? 'var(--bg-card)' : 'transparent',
                border: activeChatId === chat.$id ? '1px solid var(--border)' : '1px solid transparent',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: 12.5,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                paddingRight: 24
              }}>
                {chat.title}
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--text-tertiary)',
                marginTop: 3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                paddingRight: 24
              }}>
                {chat.lastMessage || 'New conversation'}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.$id); }}
                title="Delete"
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px 6px',
                  fontSize: 11,
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  border: 'none'
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div
      className="chat-container"
      style={{
        display: 'flex',
        background: 'var(--bg-primary)',
        height: 'calc(100vh - 56px)',
        margin: '-20px -16px',
      }}
    >
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex"
        style={{
          width: 260,
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          flexDirection: 'column',
          flexShrink: 0
        }}
      >
        <ChatList />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-screen w-[280px] flex flex-col transition-transform duration-200 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)'
        }}
      >
        <ChatList />
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 h-[56px] shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <button
            className="md:hidden !bg-transparent !text-[var(--text-primary)] !p-1.5"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open chats"
            style={{ border: 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0
          }}>
            ✨
          </div>
          <div className="min-w-0">
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.015em' }}>
              Class Catch AI
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--text-tertiary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {notesContext.length} notes loaded
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          {!activeChatId || messages.length === 0 ? (
            <EmptyChat onAsk={(q) => setInput(q)} />
          ) : (
            <div style={{ maxWidth: 780, margin: '0 auto' }}>
              {messages.map(msg => (
                <MessageBubble key={msg.$id} message={msg} userName={user.name} />
              ))}
              {thinking && <TypingIndicator />}
            </div>
          )}
        </div>

        <div className="shrink-0 px-3 sm:px-6 py-3 sm:py-5" style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 6
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your class notes..."
                rows={1}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '8px 10px',
                  fontSize: 13.5,
                  resize: 'none',
                  maxHeight: 140,
                  minHeight: 22,
                  boxShadow: 'none',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || thinking}
                style={{
                  background: input.trim() && !thinking
                    ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)'
                    : 'var(--border)',
                  color: input.trim() && !thinking ? 'white' : 'var(--text-tertiary)',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 14,
                  flexShrink: 0
                }}
              >
                ➤
              </button>
            </div>
            <p style={{
              fontSize: 10.5,
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              marginTop: 6
            }}>
              AI can make mistakes. Verify with your notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, userName }) {
  const isUser = message.role === 'user';
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      marginBottom: 16,
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start'
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 9999,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: 'white',
        background: isUser
          ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
      }}>
        {isUser ? userName?.[0]?.toUpperCase() || 'U' : '✨'}
      </div>
      <div style={{
        maxWidth: '80%',
        padding: '10px 14px',
        borderRadius: 14,
        background: isUser ? 'var(--accent)' : 'var(--bg-card)',
        color: isUser ? 'white' : 'var(--text-primary)',
        border: isUser ? 'none' : '1px solid var(--border)',
        fontSize: 13,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 9999,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        color: 'white'
      }}>
        ✨
      </div>
      <div style={{
        padding: '12px 16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        display: 'flex',
        gap: 5,
        alignItems: 'center'
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 5,
            height: 5,
            borderRadius: 9999,
            background: 'var(--text-tertiary)',
            animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`
          }} />
        ))}
        <style>{`
          @keyframes pulse {
            0%, 60%, 100% { opacity: 0.3; transform: scale(0.85); }
            30% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

function EmptyChat({ onAsk }) {
  const suggestions = [
    'What are the important points in the notes?',
    'Explain the hardest concept simply.',
    'Give me a 4-mark answer for the last topic.',
    'List key formulas with examples.'
  ];
  return (
    <div style={{ maxWidth: 640, margin: '30px auto 0', textAlign: 'center', padding: '0 16px' }}>
      <div style={{
        width: 54,
        height: 54,
        borderRadius: 15,
        background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        marginBottom: 16
      }}>
        ✨
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
        Ask anything about your notes
      </h2>
      <p style={{
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        marginBottom: 22
      }}>
        I've read all the class notes. Ask me to explain examples, summarize topics,
        or write answers for you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => onAsk(s)}
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              padding: '12px 14px',
              fontSize: 12.5,
              fontWeight: 500,
              textAlign: 'left',
              lineHeight: 1.5,
              whiteSpace: 'normal'
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}