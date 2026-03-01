import { useEffect, useState } from 'react';
import { subscribeAuth, getUserRole, signOutAuth } from './firebase';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

const HOME_URL = '/index.html';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = subscribeAuth(async (authUser) => {
      if (!authUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        window.location.href = HOME_URL;
        return;
      }
      setUser(authUser);
      try {
        const r = await getUserRole(authUser.uid);
        setRole(r);
        if (r !== 'admin') {
          window.location.href = HOME_URL;
          return;
        }
      } catch (err) {
        console.error(err);
        setError('Không thể kiểm tra quyền.');
        window.location.href = HOME_URL;
        return;
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutAuth();
      window.location.href = HOME_URL;
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-overlay" style={{ flexDirection: 'column', gap: '1rem' }}>
        <p>{error}</p>
        <a href={HOME_URL} className="btn btn-primary">Về trang chủ</a>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <Layout onLogout={handleLogout}>
      <Dashboard />
    </Layout>
  );
}
