import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { login } from '../services/authService';
import { AuthContext } from '../../../context/AuthContext';
import { account } from '../../../services/appwrite';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { setUser, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data.email, data.password);
      const user = await account.get();
      setUser(user);
      setRole(user.prefs?.role || 'student');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="error-msg">{error}</div>}

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
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{ width: '100%', padding: '12px 18px', marginTop: 4 }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>

      <p style={{
        textAlign: 'center',
        fontSize: 13.5,
        color: 'var(--text-secondary)',
        marginTop: 28,
      }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Sign up
        </Link>
      </p>
    </form>
  );
}