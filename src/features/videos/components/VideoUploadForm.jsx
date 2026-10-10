import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadVideo } from '../services/videoService';
import { AuthContext } from '../../../context/AuthContext';

const MAX_SIZE_MB = 50;

export default function VideoUploadForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setError('');
      const file = data.videoFile[0];
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File too large. Maximum ${MAX_SIZE_MB} MB. Compress it first.`);
        return;
      }
      setStatus('Uploading video...');
      await uploadVideo(file, {
        title: data.title,
        description: data.description,
        subject: data.subject,
        date: data.date
      }, user.$id, user.name);
      setStatus('Uploaded! Redirecting...');
      navigate('/videos');
    } catch (err) {
      setError(err.message || 'Upload failed');
      setStatus('');
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 32 }}>
        <div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: 6
          }}>
            Upload Class Video ⬆️
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Share a recorded class with everyone
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 28
        }}
      >
        {/* Size hint banner */}
        <div style={{
          padding: 14,
          background: 'var(--amber-soft)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 10,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10
        }}>
          <span style={{ fontSize: 16, lineHeight: 1.3 }}>💡</span>
          <div>
            <p style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 2
            }}>
              Max file size: {MAX_SIZE_MB} MB
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Compress videos to 720p / 1 Mbps before uploading to stay under the limit.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-msg" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Title</label>
          <input
            placeholder="e.g. Introduction to Photosynthesis"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <span className="field-error">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            placeholder="e.g. Biology"
            {...register('subject', { required: 'Subject is required' })}
          />
          {errors.subject && <span className="field-error">{errors.subject.message}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={4}
            placeholder="What's covered in this class?"
            {...register('description')}
          />
        </div>

        <div className="form-group">
          <label>Class date</label>
          <input type="date" {...register('date')} />
        </div>

        <div className="form-group">
          <label>Video file</label>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            {...register('videoFile', { required: 'Video file is required' })}
          />
          {errors.videoFile && <span className="field-error">{errors.videoFile.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            border: 'none',
            padding: '11px 24px',
            marginTop: 8
          }}
        >
          {isSubmitting ? 'Uploading...' : 'Upload video'}
        </button>

        {status && (
          <p style={{
            marginTop: 16,
            fontSize: 13,
            color: 'var(--accent)',
            fontWeight: 500
          }}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}