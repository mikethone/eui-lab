import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { EuiProvider } from '@elastic/eui'
import './index.css'
import App from './App.jsx'
import { pmTheme } from './theme/euiTheme'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <EuiProvider modify={pmTheme}>
      <App />
    </EuiProvider>
  </BrowserRouter>
)