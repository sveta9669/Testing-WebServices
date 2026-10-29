export class AuthPage {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  createToken(credentials) {
    return this.apiClient.requestJson('auth', {
      method: 'POST',
      body: credentials,
    });
  }
}
