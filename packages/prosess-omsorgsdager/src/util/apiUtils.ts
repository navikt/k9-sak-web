import querystring from 'querystring';

export async function get<T>(path: string, params?: any): Promise<T> {
  return fetch(`${path}?${querystring.encode(params)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(response => response.json());
}

export async function patch(path: string, body?: any): Promise<Response> {
  return fetch(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}
