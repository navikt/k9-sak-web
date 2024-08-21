export interface NavCallidHeader {
  readonly headerName: 'Nav-Callid';
  readonly headerValue: string;
}

const generateNewNavCallId = () => `CallId_${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`;

export const generateNavCallidHeader = (): NavCallidHeader => ({
  headerName: 'Nav-Callid',
  headerValue: generateNewNavCallId(),
});

export const addNavCallidToRequestInit = (request: RequestInit): RequestInit => {
  // Normalize to a Headers object
  const newHeaders = new Headers(request.headers);
  const { headerName, headerValue } = generateNavCallidHeader();
  newHeaders.set(headerName, headerValue);
  request.headers = newHeaders;
  return request;
};
