import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TeacherDashboard from '../features/dashboard/TeacherDashboard';
import StudentDashboard from '../features/dashboard/StudentDashboard';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { role, loading } = useContext(AuthContext);
  if (loading) return <Loader />;
  return role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
}