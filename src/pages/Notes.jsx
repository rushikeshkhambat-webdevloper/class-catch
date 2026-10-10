import { useEffect, useState } from 'react';
import { getAllNotes } from '../features/notes/services/noteService';
import NoteCard from '../features/notes/components/NoteCard';
import NoteForm from '../features/notes/components/NoteForm';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAllNotes()
      .then(res => setNotes(res.documents))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n =>
    (n.title + ' ' + n.content + ' ' + n.studentName)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{
        display: 'flex', flexDirection: 'column',
        gap: 16, marginBottom: 28,
      }} className="sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            letterSpacing: '-0.025em', marginBottom: 6,
          }}>
            Class Notes 📝
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Notes shared by students and teachers across all classes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          style={{
            alignSelf: 'flex-start',
            background: showForm ? 'transparent' : 'var(--accent)',
            color: showForm ? 'var(--text-primary)' : 'white',
            border: showForm ? '1px solid var(--border)' : 'none',
            padding: '11px 20px',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Write a note'}
        </button>
      </div>

      {showForm && (
        <NoteForm
          onCreated={(newNote) => {
            setNotes([newNote, ...notes]);
            setShowForm(false);
          }}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search notes by title, content, or author..."
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12, padding: 20,
            }}>
              <div className="skeleton" style={{ height: 14, width: '30%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '80%' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '60px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.5 }}>📝</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            {query ? 'No notes match your search' : 'No notes yet'}
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 22 }}>
            {query ? 'Try a different search term.' : 'Be the first to share what you learned.'}
          </p>
          {!query && !showForm && (
            <button onClick={() => setShowForm(true)}>Write the first note</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(n => (
            <NoteCard
              key={n.$id}
              note={n}
              onUpdate={(u) => setNotes(notes.map(x => x.$id === u.$id ? u : x))}
              onDelete={(id) => setNotes(notes.filter(x => x.$id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}