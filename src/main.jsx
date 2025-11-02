import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Enable dark mode by default by adding the `dark` class to the <html> element.
// Tailwind is configured for `darkMode: 'class'` so the `.dark` root will activate
// the dark variants and our CSS overrides in `src/index.css`.
try {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {
  // ignore in non-browser environments
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
