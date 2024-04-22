import type * as http from "node:http";
import type { ProxyOptions, ServerOptions } from "vite";

type Responder = (req: http.IncomingMessage, res: http.ServerResponse) => void

// Ein liten hjelpefunksjon for å bruke vite dev server sin proxy server til å respondere med falske responser istadenfor
// å kalle ein faktisk (ekstern) server for å få respons.
// Erstatter vite-plugin-mock
export const createMockResponder = (target: string, responder: Responder): ProxyOptions => ({
    target,
    ws: false,
    secure: false,
    configure: proxy => {
      proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage, res: http.ServerResponse, opts: ServerOptions) => {
        // Call the provided Responder
        responder(req, res)
        // Call res end to return the response, and not go on to actually call any other server
        res.end()
      })
    }
  })


// Hjelpefunksjon for å returnere statisk json
export const staticJsonResponse = (response: any): Responder => (req, res) => {
  try {
    const jsonHeaders = {
      "Content-Type": "application/json"
    }
    res.writeHead(200, 'Ok', jsonHeaders)
    res.write(JSON.stringify(response))
  } catch (e) {
    const headers = {
      "Content-Type": "text/plain"
    }
    res.writeHead(500, 'Error', headers)
    res.write(`Error in staticJsonResponder: ${e.message}`)
  }
}
