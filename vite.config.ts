import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'http'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'claude-proxy',
        configureServer(server) {
          server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
            if (!req.url?.startsWith('/api/claude')) return next()

            const targetPath = req.url.replace('/api/claude', '')
            const chunks: Buffer[] = []

            req.on('data', (chunk: Buffer) => chunks.push(chunk))
            req.on('end', async () => {
              try {
                const body = Buffer.concat(chunks).toString()
                const response = await fetch(`https://api.anthropic.com${targetPath}`, {
                  method: req.method ?? 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': env.CLAUDE_API_KEY ?? '',
                    'anthropic-version': '2023-06-01',
                  },
                  body: body || undefined,
                })
                res.statusCode = response.status
                res.setHeader('Content-Type', 'application/json')
                res.end(await response.text())
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: String(err) }))
              }
            })
          })
        },
      },
    ],
    define: {
      global: 'globalThis',
      'process.env': '{}',
    },
  }
})
