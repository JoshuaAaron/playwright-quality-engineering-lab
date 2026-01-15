import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { users } from '../../src/data/users'

const parseBody = async (req: IncomingMessage) =>
  new Promise<string>((resolve) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf-8')
    })
    req.on('end', () => resolve(body))
  })

const sendJson = (
  res: ServerResponse,
  statusCode: number,
  payload: object,
) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export const startMockApiServer = async () => {
  const server = createServer(async (req, res) => {
    if (!req.url || !req.method) {
      sendJson(res, 400, { ok: false, message: 'Invalid request.' })
      return
    }

    if (req.url === '/health' && req.method === 'GET') {
      sendJson(res, 200, { ok: true, status: 'healthy' })
      return
    }

    if (req.url === '/login' && req.method === 'POST') {
      const raw = await parseBody(req)
      const payload = JSON.parse(raw || '{}') as {
        email?: string
        password?: string
      }

      const match = users.find(
        (user) => user.email === payload.email && user.password === payload.password,
      )

      if (!match) {
        sendJson(res, 401, { ok: false, message: 'Invalid credentials.' })
        return
      }

      sendJson(res, 200, {
        ok: true,
        message: `Welcome, ${match.name}.`,
        userId: match.id,
      })
      return
    }

    sendJson(res, 404, { ok: false, message: 'Not found.' })
  })

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve())
  })

  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Unable to determine mock API server address.')
  }

  return {
    url: `http://localhost:${address.port}`,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve())
      }),
  }
}
