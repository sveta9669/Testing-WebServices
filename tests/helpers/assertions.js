import assert from 'node:assert/strict';

export async function assertJsonResponse(response, expectedStatus) {
  assert.strictEqual(response.status, expectedStatus);
  assert.strictEqual(response.ok, true);
  assert.match(response.headers.get('content-type') ?? '', /application\/json/i);

  return response.json();
}

export function assertBooking(actualBooking, expectedBooking) {
  assert.deepStrictEqual(actualBooking, expectedBooking);
}
