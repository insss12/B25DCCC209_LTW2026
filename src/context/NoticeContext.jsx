import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState('');

  const showNotice = useCallback((message) => {
    setNotice(message);
  }, []);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice('');
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notice]);

  const value = { notice, showNotice };

  return (
    <NoticeContext.Provider value={value}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);

  if (!context) {
    throw new Error(
      'useNotice phải được sử dụng bên trong NoticeProvider'
    );
  }

  return context;
};