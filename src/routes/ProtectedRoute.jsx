import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Loader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}