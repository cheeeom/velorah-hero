import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 字体自托管（原 fonts.googleapis.com 在国内被墙，会回退系统字体）
// 只引 latin 子集：中文由系统衬线/无衬线兜底，无需下载任何 CJK 字体
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
