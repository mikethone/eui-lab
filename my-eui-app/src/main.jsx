import { createRoot } from 'react-dom/client'
import { EuiProvider } from '@elastic/eui'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <EuiProvider>
    <App />
  </EuiProvider>
)