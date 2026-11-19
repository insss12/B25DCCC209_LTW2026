import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.js';

import { store } from './redux/store';

import { ThemeProvider } from './context/ThemeContext';
import { NoticeProvider } from './context/NoticeContext';

import './index.css';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <Provider store={store}>
    <ThemeProvider>
      <NoticeProvider>
        <App />
      </NoticeProvider>
    </ThemeProvider>
  </Provider>
);