import { createRoot } from 'react-dom/client'
import { EuiProvider } from '@elastic/eui'
import './index.css'
import App from './App.jsx'
import { pmTheme } from './theme/pmTheme'

createRoot(document.getElementById('root')).render(
  <EuiProvider modify={pmTheme}>
    <App />
  </EuiProvider>
)