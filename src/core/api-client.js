export class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  }

  async request(path, { query, ...options } = {}) {
    const url = new URL(path.replace(/^\/+/, ''), this.baseUrl);

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    }

    return fetch(url, options);
  }

  requestJson(path, { method = 'GET', body, headers = {}, query } = {}) {
    const jsonHeaders = {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    };

    return this.request(path, {
      method,
      headers: jsonHeaders,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      query,
    });
  }
}
