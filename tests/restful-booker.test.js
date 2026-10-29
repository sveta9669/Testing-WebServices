import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authPage, bookingPage } from './config/test-config.js';
import {
  credentials,
  initialBookingData,
  updatedBookingData,
} from './fixtures/booking-data.js';
import {
  assertBooking,
  assertJsonResponse,
} from './helpers/assertions.js';

describe('Restful-Booker API test suite', () => {
  let authToken;
  let createdBookingId;

  it('creates an auth token', async () => {
    const response = await authPage.createToken(credentials);
    const body = await assertJsonResponse(response, 200);

    assert.ok(body.token);
    assert.strictEqual(typeof body.token, 'string');
    authToken = body.token;
  });

  it('creates a booking', async () => {
    const response = await bookingPage.createBooking(initialBookingData);
    const body = await assertJsonResponse(response, 200);

    assert.ok(Number.isInteger(body.bookingid));
    assert.ok(body.bookingid > 0);
    assertBooking(body.booking, initialBookingData);
    createdBookingId = body.bookingid;
  });

  it('retrieves the created booking', async () => {
    assert.ok(createdBookingId);

    const response = await bookingPage.getBookingById(createdBookingId);
    const body = await assertJsonResponse(response, 200);

    assertBooking(body, initialBookingData);
  });

  it('updates the booking using the auth token', async () => {
    assert.ok(createdBookingId);
    assert.ok(authToken);

    const response = await bookingPage.updateBooking(
      createdBookingId,
      updatedBookingData,
      authToken,
    );
    const body = await assertJsonResponse(response, 200);

    assertBooking(body, updatedBookingData);
  });

  it('deletes the booking and verifies it no longer exists', async () => {
    assert.ok(createdBookingId);
    assert.ok(authToken);

    const deleteResponse = await bookingPage.deleteBooking(createdBookingId, authToken);
    assert.strictEqual(deleteResponse.status, 201);
    assert.ok(deleteResponse.headers.has('content-type'));
    assert.strictEqual(await deleteResponse.text(), 'Created');

    const verifyResponse = await bookingPage.getBookingById(createdBookingId);
    assert.strictEqual(verifyResponse.status, 404);
    assert.strictEqual(verifyResponse.ok, false);
    assert.ok(verifyResponse.headers.has('content-type'));
    assert.strictEqual(await verifyResponse.text(), 'Not Found');
  });
});
