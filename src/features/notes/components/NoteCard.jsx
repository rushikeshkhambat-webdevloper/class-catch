import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { toggleUpvote, deleteNote, getNoteFileUrl } from '../services/noteService';
import { summarizeText, getNoteFullText } from '../../ai/services/aiService';

export default function NoteCard({ note, onUpdate, onDelete }) {
  const { user } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  const isOwner = note.studentId === user?.$id;
  const upvotedList = (note.upvotedBy || '').split(',').filter(Boolean);
  const hasUpvoted = upvotedList.includes(user?.$id);
  const isImage = note.fileType?.startsWith('image/');

  const fullText = getNoteFullText(note);
  const canSummarize = fullText.trim().length > 0;

  async function handleUpvote() {
    if (busy) return;
    setBusy(true);
    try {
      const updated = await toggleUpvote(note, user.$id);
      onUpdate?.(updated);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this note?')) return;
    await deleteNote(note);
    onDelete?.(note.$id);
  }

  async function handleSummarize() {
    if (summarizing || !canSummarize) return;
    setSummarizing(true);
    try {
      const result = await summarizeText(fullText, 'note');
      setSummary(result);
    } catch (err) {
      alert('Summarize failed: ' + err.message);
    } finally {
      setSummarizing(false);
    }
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 18
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9999,
            background: '#0f766e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0
          }}>
            {note.studentName?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
              {note.studentName}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
              {new Date(note.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {note.videoId && (
          <Link
            to={`/videos/${note.videoId}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px',
              background: 'var(--accent-soft)', color: 'var(--accent)',
              borderRadius: 9999, fontSize: 10.5, fontWeight: 600,
              flexShrink: 0
            }}
          >
            🎥 Video
          </Link>
        )}
      </div>

      {note.title && (
        <h4 style={{
          fontSize: 15, fontWeight: 600,
          letterSpacing: '-0.015em', marginBottom: 8,
          lineHeight: 1.35
        }}>
          {note.title}
        </h4>
      )}

      {note.content && (
        <p style={{
          whiteSpace: 'pre-wrap', marginBottom: 12,
          fontSize: 13.5, lineHeight: 1.65,
          color: 'var(--text-primary)', wordBreak: 'break-word'
        }}>
          {note.content}
        </p>
      )}

      {note.fileId && (
        <div style={{ marginBottom: 12 }}>
          {isImage ? (
            <img
              src={getNoteFileUrl(note.fileId)}
              alt={note.fileName}
              style={{
                maxWidth: '100%',
                borderRadius: 10,
                border: '1px solid var(--border)'
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href={getNoteFileUrl(note.fileId)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 13, color: 'var(--text-primary)',
                  textDecoration: 'none',
                  maxWidth: '100%',
                  alignSelf: 'flex-start'
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>📎</span>
                <span style={{
                  fontWeight: 500,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {note.fileName || 'Attached file'}
                </span>
                {note.fileSize ? (
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>
                    {(note.fileSize / 1024 / 1024).toFixed(1)} MB
                  </span>
                ) : null}
              </a>

              {/* Extracted text badge */}
              {note.extractedText && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px',
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  borderRadius: 9999, fontSize: 11, fontWeight: 600,
                  alignSelf: 'flex-start'
                }}>
                  ✓ Text extracted ({note.extractedText.length.toLocaleString()} chars)
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {summary && (
        <div style={{
          marginTop: 12, padding: 14,
          background: 'var(--accent-soft)',
          borderRadius: 10,
          borderLeft: '3px solid var(--accent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 13 }}>✨</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: 'var(--accent)',
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              AI Summary
            </span>
          </div>
          <p style={{
            whiteSpace: 'pre-wrap', fontSize: 13.5,
            lineHeight: 1.65, color: 'var(--text-primary)',
            wordBreak: 'break-word'
          }}>
            {summary}
          </p>
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        marginTop: 14, paddingTop: 14,
        borderTop: '1px solid var(--border)'
      }}>
        <button
          onClick={handleUpvote}
          disabled={busy}
          style={{
            padding: '6px 12px', fontSize: 12, fontWeight: 600,
            background: hasUpvoted ? 'var(--accent)' : 'transparent',
            color: hasUpvoted ? 'white' : 'var(--text-secondary)',
            border: '1px solid ' + (hasUpvoted ? 'var(--accent)' : 'var(--border)')
          }}
        >
          ▲ {note.upvotes || 0}
        </button>

        {canSummarize && (
          <button
            onClick={handleSummarize}
            disabled={summarizing}
            style={{
              padding: '6px 12px', fontSize: 12, fontWeight: 600,
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}
          >
            {summarizing ? '✨ Summarizing...' : '✨ Summarize'}
          </button>
        )}

        {isOwner && (
          <button
            onClick={handleDelete}
            style={{
              marginLeft: 'auto',
              padding: '6px 10px', fontSize: 12,
              background: 'transparent',
              color: 'var(--text-tertiary)',
              border: '1px solid transparent'
            }}
            title="Delete"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}