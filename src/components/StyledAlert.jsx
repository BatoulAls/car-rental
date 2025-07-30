import React, { useEffect } from 'react';
import '../styles/StyledAlert.css';

const StyledAlert = ({
  isVisible,
  onClose,
  title,
  message,
  type = 'info',
  showConfirm = false,
  onConfirm = null,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  useEffect(() => {
    if (isVisible && !showConfirm) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, showConfirm, onClose]);

  if (!isVisible) return null;

  const alertClass = `alert-modal alert-${showConfirm ? 'confirm' : type}`;

  return (
    <>
      <div className="alert-backdrop" onClick={!showConfirm ? onClose : undefined} />

      <div className={alertClass}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ fontSize: '24px', color: 'inherit' }}>
            {{
              success: '✅',
              error: '❌',
              warning: '⚠️',
              info: 'ℹ️',
              confirm: '❓'
            }[showConfirm ? 'confirm' : type]}
          </div>
          <div style={{ flex: 1 }}>
            {title && <h3 className="alert-title">{title}</h3>}
            <p className="alert-message">{message}</p>
          </div>
        </div>

        <div className="alert-buttons">
          {showConfirm ? (
            <>
              <button className="alert-btn btn-cancel" onClick={onClose}>
                {cancelText}
              </button>
              <button className="alert-btn btn-confirm" onClick={onConfirm}>
                {confirmText}
              </button>
            </>
          ) : (
            <button className="alert-btn btn-ok" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default StyledAlert;
