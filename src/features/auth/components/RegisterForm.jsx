import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { register as registerUser } from '../services/authService';
import { AuthContext } from '../../../context/AuthContext';
import { account } from '../../../services/appwrite';

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { setUser, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  const onSubmit = async (data) => {
    try {
      setError('');
      await registerUser(data.email, data.password, data.name, data.role);
      const user = await account.get();
      setUser(user);
      setRole(data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="error-msg">{error}</div>}

      <div className="form-group">
        <label>Full name</label>
        <input
          placeholder="Your name"
          autoComplete="name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
          })}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label>I am a</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { value: 'student', label: 'Student', icon: '🎒' },
            { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
          ].map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 14px',
                borderRadius: 8,
                border: selectedRole === opt.value
                  ? '1.5px solid var(--accent)'
                  : '1px solid var(--border)',
                background: selectedRole === opt.value ? 'var(--accent-soft)' : 'white',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                value={opt.value}
                {...register('role', { required: true })}
                onChange={() => setSelectedRole(opt.value)}
                style={{ width: 'auto', margin: 0, padding: 0, accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: 16 }}>{opt.icon}</span>
              <span style={{
                fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)',
              }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {errors.role && <span className="field-error">Please select a role</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{ width: '100%', padding: '12px 18px', marginTop: 4 }}
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>

      <p style={{
        textAlign: 'center',
        fontSize: 13.5,
        color: 'var(--text-secondary)',
        marginTop: 28,
      }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </form>
  );
}