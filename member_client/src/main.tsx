import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./main.scss"
import './i18n/index.ts'
import { store } from '@/store/index.ts'
import { Provider } from 'react-redux'

import './main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store} >
        <App />
    </Provider>
)
