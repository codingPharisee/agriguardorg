import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Routes that match App.tsx
const routesToPrerender = [
  '/',
  '/fact-check',
  '/blogs',
  '/viral-farm',
  '/myth-buster',
  '/tools',
  '/about',
  '/contact',
  '/auth',
  '/admin',
  '/pest-identification',
  '/crop-recommendations'
]

;(async () => {
  for (const url of routesToPrerender) {
    const appHtml = render(url);
    const html = template.replace(`<!--app-html-->`, appHtml)

    // Create directory if it doesn't exist
    const filePath = url === '/' ? '/index.html' : `${url}.html`
    const fullPath = toAbsolute(`dist${filePath}`)
    const dirPath = path.dirname(fullPath)
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    fs.writeFileSync(fullPath, html)
    console.log('pre-rendered:', filePath)
  }
})()