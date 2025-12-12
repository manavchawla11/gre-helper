import { useEffect } from 'react';

export default function Toast({ type = 'success', title, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast ${type === 'error' ? 'error' : ''}`}>
      <div className="toast-title">{title}</div>
      <div className="toast-sub">{message}</div>
    </div>
  );
}
