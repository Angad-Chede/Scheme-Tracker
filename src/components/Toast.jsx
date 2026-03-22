import '../styles/toast.css';

export default function Toast({ toast }) {
  if (!toast) return null;
  const bg = toast.type === 'success' ? '#059669' : toast.type === 'error' ? '#dc2626' : '#1d4ed8';
  return (
    <div className="toast" style={{ background: bg }}>{toast.msg}</div>
  );
}
