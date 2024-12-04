import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'

const root = createRoot(document.querySelector('#root'))

root.render(
  <App clickerAmount={4}>
    <h2>Foo</h2>
    <h2>Bar</h2>
  </App>
)
