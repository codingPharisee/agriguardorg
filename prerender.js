import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Routes to prerender - matches App.tsx routes
// NOTE: When adding new pages/blogs, make sure to add them here for SEO benefits
const routesToPrerender = [
  '/',
  '/fact-check',
  '/blogs', 
  '/viral-farm',
  '/myth-buster',
  '/tools',
  '/about',
  '/contact',
  '/pest-identification',
  '/crop-recommendations'
  // Add new routes here when creating new pages
]

// Helper function to ensure directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

;(async () => {
  for (const url of routesToPrerender) {
    try {
      const appHtml = render(url);
      const html = template.replace(`<!--app-html-->`, appHtml)

      const filePath = url === '/' 
        ? toAbsolute('dist/index.html')
        : toAbsolute(`dist${url}/index.html`)
      
      // Ensure the directory exists before writing
      ensureDirectoryExists(filePath)
      
      fs.writeFileSync(filePath, html)
      console.log('pre-rendered:', filePath)
    } catch (error) {
      console.error(`Failed to prerender ${url}:`, error.message)
    }
  }
})()