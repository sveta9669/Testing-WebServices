export class BookingPage {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  getBookingIds(params = {}) {
    return this.apiClient.requestJson('booking', { query: params });
  }

  getBookingById(bookingId) {
    return this.apiClient.requestJson(this._bookingPath(bookingId));
  }

  createBooking(bookingData) {
    return this.apiClient.requestJson('booking', {
      method: 'POST',
      body: bookingData,
    });
  }

  updateBooking(bookingId, bookingData, token) {
    return this.apiClient.requestJson(this._bookingPath(bookingId), {
      method: 'PUT',
      body: bookingData,
      headers: this._authHeaders(token),
    });
  }

  partialUpdateBooking(bookingId, partialData, token) {
    return this.apiClient.requestJson(this._bookingPath(bookingId), {
      method: 'PATCH',
      body: partialData,
      headers: this._authHeaders(token),
    });
  }

  deleteBooking(bookingId, token) {
    return this.apiClient.request(this._bookingPath(bookingId), {
      method: 'DELETE',
      headers: this._authHeaders(token),
    });
  }

  _bookingPath(bookingId) {
    return `booking/${encodeURIComponent(bookingId)}`;
  }

  _authHeaders(token) {
    return token ? { Cookie: `token=${token}` } : {};
  }
}
