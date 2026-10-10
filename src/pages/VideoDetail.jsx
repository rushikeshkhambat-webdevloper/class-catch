import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoById } from '../features/videos/services/videoService';
import { getNotesForVideo } from '../features/notes/services/noteService';
import { summarizeText } from '../features/ai/services/aiService';
import VideoPlayer from '../features/videos/components/VideoPlayer';
import NoteForm from '../features/notes/components/NoteForm';
import NoteCard from '../features/notes/components/NoteCard';
import Loader from '../components/Loader';

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    Promise.all([getVideoById(id), getNotesForVideo(id)])
      .then(([v, n]) => { setVideo(v); setNotes(n.documents); })
      .catch(() => navigate('/videos'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleSummarizeVideo() {
    if (summarizing || !video?.description) return;
    setSummarizing(true);
    try {
      setSummary(await summarizeText(video.description, 'video'));
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setSummarizing(false);
    }
  }

  if (loading) return <Loader />;
  if (!video) return null;

  return (
    <div style={{ maxWidth: 1000 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          color: 'var(--text-secondary)',
          padding: 0,
          fontSize: 13.5,
          fontWeight: 500,
          marginBottom: 18,
        }}
      >
        ← Back
      </button>

      <VideoPlayer fileId={video.fileId} />

      <div style={{
        marginTop: 24,
        marginBottom: 32,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 24,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: 12, marginBottom: 16,
        }} className="sm:flex-row sm:items-start sm:justify-between">
          <h1 style={{
            fontSize: 22, fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.3,
            flex: 1,
          }}>
            {video.title}
          </h1>
          <span style={{
            padding: '5px 12px',
            background: 'var(--accent-soft)', color: 'var(--accent)',
            borderRadius: 9999, fontSize: 12, fontWeight: 600,
            alignSelf: 'flex-start',
          }}>
            {video.subject}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 20 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9999,
            background: '#0f766e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {video.teacherName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>
              {video.teacherName}
            </p>
            {video.date && (
              <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                {video.date}
              </p>
            )}
          </div>
        </div>

        {video.description && (
          <p style={{
            whiteSpace: 'pre-wrap', fontSize: 14,
            lineHeight: 1.7, color: 'var(--text-primary)',
            marginBottom: 20,
          }}>
            {video.description}
          </p>
        )}

        {video.description && (
          <button
            onClick={handleSummarizeVideo}
            disabled={summarizing}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              fontSize: 13,
            }}
          >
            {summarizing ? '✨ Summarizing...' : '✨ Summarize Video'}
          </button>
        )}

        {summary && (
          <div style={{
            marginTop: 18,
            padding: 16,
            background: 'var(--accent-soft)',
            borderRadius: 10,
            borderLeft: '3px solid var(--accent)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 13 }}>✨</span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: 'var(--accent)',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                AI Summary
              </span>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', fontSize: 13.5, lineHeight: 1.7 }}>
              {summary}
            </p>
          </div>
        )}
      </div>

      <section>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 14, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Class Notes
            </h2>
            {notes.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 600,
                padding: '3px 9px',
                background: 'var(--accent-soft)', color: 'var(--accent)',
                borderRadius: 9999,
              }}>
                {notes.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            style={{
              background: showForm ? 'transparent' : 'var(--accent)',
              color: showForm ? 'var(--text-primary)' : 'white',
              border: showForm ? '1px solid var(--border)' : 'none',
              padding: '9px 16px', fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {showForm ? '✕ Cancel' : '+ Add Note'}
          </button>
        </div>

        {showForm && (
          <NoteForm
            videoId={id}
            onCreated={(n) => { setNotes([n, ...notes]); setShowForm(false); }}
          />
        )}

        {notes.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '48px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 42, marginBottom: 14, opacity: 0.5 }}>📝</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              No notes yet
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Be the first to share notes for this class.
            </p>
            {!showForm && (
              <button onClick={() => setShowForm(true)}>
                Add the first note
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {notes.map(n => (
              <NoteCard
                key={n.$id}
                note={n}
                onUpdate={(u) => setNotes(notes.map(x => x.$id === u.$id ? u : x))}
                onDelete={(nid) => setNotes(notes.filter(x => x.$id !== nid))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}