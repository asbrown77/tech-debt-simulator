import { rulesModalContent, gameEndModalContent } from './ModalContent';

type GeneralModalProps = {
  isOpen: boolean;
  onClose: () => void;
  buttonText?: string;  // ← make it optional
  children: React.ReactNode;
};

export const GeneralModal: React.FC<GeneralModalProps> = ({
  isOpen,
  onClose,
  buttonText = 'Close',
  children
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        <div style={{ fontFamily: 'sans-serif', padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4dabf7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90%',
    overflowY: 'auto' as const,
    position: 'relative' as const,
    boxShadow: '0 0 30px rgba(0,0,0,0.2)',
  },
  closeButton: {
    position: 'absolute' as const,
    top: '10px',
    right: '15px',
    fontSize: '1.5rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#888',
  },
};
