export const BASE_URL = process.env.BASE_URL || 'https://restful-booker.herokuapp.com';

export async function ping() {
  return await fetch(`${BASE_URL}/ping`, {
    method: 'GET',
  });
}

export async function createToken(credentials = { username: 'admin', password: 'password123' }) {
  return await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
}

export async function getBookingIds(params = {}) {
  const url = new URL(`${BASE_URL}/booking`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  }

  return await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
}

export async function getBookingById(bookingId) {
  return await fetch(`${BASE_URL}/booking/${bookingId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
}

export async function createBooking(bookingData) {
  return await fetch(`${BASE_URL}/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
}

export async function updateBooking(bookingId, bookingData, token) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Cookie'] = `token=${token}`;
  }

  return await fetch(`${BASE_URL}/booking/${bookingId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(bookingData),
  });
}

export async function partialUpdateBooking(bookingId, partialData, token) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Cookie'] = `token=${token}`;
  }

  return await fetch(`${BASE_URL}/booking/${bookingId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(partialData),
  });
}

export async function deleteBooking(bookingId, token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Cookie'] = `token=${token}`;
  }

  return await fetch(`${BASE_URL}/booking/${bookingId}`, {
    method: 'DELETE',
    headers,
  });
}
