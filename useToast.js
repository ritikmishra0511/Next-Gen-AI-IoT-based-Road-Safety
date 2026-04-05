// src/hooks/useToast.js
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div
            key={t.id}
            className="animate-fade-up"
            style={{
              background: t.type === 'success' ? 'rgba(0,229,192,0.12)' :
                          t.type === 'error'   ? 'rgba(255,71,87,0.12)' :
                          t.type === 'warning' ? 'rgba(255,184,0,0.12)' :
                          'rgba(59,130,246,0.12)',
              border: `1px solid ${
                t.type === 'success' ? 'rgba(0,229,192,0.3)' :
                t.type === 'error'   ? 'rgba(255,71,87,0.3)' :
                t.type === 'warning' ? 'rgba(255,184,0,0.3)' :
                'rgba(59,130,246,0.3)'
              }`,
              color: t.type === 'success' ? '#00E5C0' :
                     t.type === 'error'   ? '#FF4757' :
                     t.type === 'warning' ? '#FFB800' : '#3B82F6',
              padding: '12px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              backdropFilter: 'blur(12px)',
              pointerEvents: 'auto',
              maxWidth: '320px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {t.type === 'success' ? '✅ ' : t.type === 'error' ? '❌ ' : t.type === 'warning' ? '⚠️ ' : 'ℹ️ '}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
