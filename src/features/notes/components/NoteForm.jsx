import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { createNote } from '../services/noteService';
import { getVideos } from '../../videos/services/videoService';
import { AuthContext } from '../../../context/AuthContext';

export default function NoteForm({ videoId = '', onCreated }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { videoId },
  });
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);

  const watchedFile = watch('file');

  useEffect(() => {
    if (!videoId) {
      getVideos().then(res => setVideos(res.documents)).catch(() => {});
    }
  }, [videoId]);

  useEffect(() => {
    if (watchedFile?.[0]) {
      const f = watchedFile[0];
      setFileInfo({
        name: f.name,
        sizeMB: (f.size / 1024 / 1024).toFixed(2),
        isOverLimit: f.size > 1024 * 1024,
      });
    } else {
      setFileInfo(null);
    }
  }, [watchedFile]);

  const onSubmit = async (data) => {
    try {
      setError('');
      const note = await createNote(
        { ...data, videoId: data.videoId || videoId },
        user.$id,
        user.name
      );
      reset({ title: '', content: '', videoId: videoId || '', file: null });
      setFileInfo(null);
      onCreated?.(note);
    } catch (err) {
      setError(err.message || 'Failed to save');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: 'var(--accent-soft)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17,
        }}>
          ✍️
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em' }}>
            Write a note
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
            Share what you learned with your classmates
          </p>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="form-group">
        <label>Title (optional)</label>
        <input
          placeholder="e.g. Chapter 5 — Photosynthesis summary"
          {...register('title')}
        />
      </div>

      {!videoId && (
        <div className="form-group">
          <label>Attach to a video (optional)</label>
          <select {...register('videoId')}>
            <option value="">— Standalone note —</option>
            {videos.map(v => (
              <option key={v.$id} value={v.$id}>
                {v.title} · {v.subject}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Content</label>
        <textarea
          rows={6}
          placeholder="Write your notes here..."
          {...register('content', { required: 'Content is required' })}
        />
        {errors.content && <span className="field-error">{errors.content.message}</span>}
      </div>

      <div className="form-group">
        <label>Attach a file (optional — PDF, image, or doc)</label>

        {/* Hint banner */}
        <div style={{
          padding: '11px 14px',
          background: 'var(--amber-soft)',
          border: '1px solid rgba(217, 119, 6, 0.25)',
          borderRadius: 8,
          marginBottom: 12,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 15, lineHeight: 1.4 }}>💡</span>
          <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-primary)' }}>
            <strong style={{ fontWeight: 600 }}>For AI to read your PDF:</strong>{' '}
            keep it under <strong>1 MB</strong>. Compress larger PDFs at{' '}
            <a
              href="https://www.ilovepdf.com/compress_pdf"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent)', fontWeight: 600 }}
            >
              ilovepdf.com/compress_pdf
            </a>{' '}
            (free) before uploading.
          </div>
        </div>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.txt,.md"
          {...register('file')}
        />

        {/* File size feedback */}
        {fileInfo && (
          <div style={{
            marginTop: 10,
            padding: '9px 12px',
            background: fileInfo.isOverLimit ? 'var(--amber-soft)' : 'var(--emerald-soft)',
            border: `1px solid ${fileInfo.isOverLimit ? 'rgba(217,119,6,0.25)' : 'rgba(5,150,105,0.25)'}`,
            borderRadius: 8,
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 13 }}>
              {fileInfo.isOverLimit ? '⚠️' : '✓'}
            </span>
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>{fileInfo.name}</strong> — {fileInfo.sizeMB} MB
              {fileInfo.isOverLimit ? (
                <span style={{ color: 'var(--amber)' }}>
                  {' '}· too large for AI reading. The file still uploads, but the AI won't be able to read it.
                </span>
              ) : (
                <span style={{ color: 'var(--emerald)' }}>
                  {' '}· will be read by AI
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} style={{ padding: '11px 22px' }}>
        {isSubmitting ? 'Posting...' : 'Post note'}
      </button>
    </form>
  );
}