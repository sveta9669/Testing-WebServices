import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createToken,
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../src/api.js';

describe('Restful-Booker API Test Suite', () => {
  let authToken;
  let createdBookingId;

  const initialBookingData = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-11-01',
      checkout: '2026-11-10',
    },
    additionalneeds: 'Breakfast',
  };

  const updatedBookingData = {
    firstname: 'John',
    lastname: 'UpdatedDoe',
    totalprice: 250,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-11-05',
      checkout: '2026-11-15',
    },
    additionalneeds: 'Airport Shuttle',
  };

  it('Scenario 1: Create auth token and verify response', async () => {
    const response = await createToken({
      username: 'admin',
      password: 'password123',
    });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.ok, true);

    assert.ok(response.headers.has('content-type'));
    assert.match(response.headers.get('content-type'), /application\/json/);

    const body = await response.json();
    assert.ok(body);
    assert.ok(typeof body.token === 'string');
    assert.ok(body.token.length > 0);

    authToken = body.token;
  });

  it('Scenario 2: Create a new booking', async () => {
    const response = await createBooking(initialBookingData);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.ok, true);

    assert.ok(response.headers.has('content-type'));
    assert.match(response.headers.get('content-type'), /application\/json/);

    const body = await response.json();
    assert.ok(body);
    assert.ok(typeof body.bookingid === 'number');
    assert.ok(body.bookingid > 0);

    assert.ok(body.booking);
    assert.strictEqual(body.booking.firstname, initialBookingData.firstname);
    assert.strictEqual(body.booking.lastname, initialBookingData.lastname);
    assert.strictEqual(body.booking.totalprice, initialBookingData.totalprice);
    assert.strictEqual(body.booking.depositpaid, initialBookingData.depositpaid);
    assert.deepStrictEqual(body.booking.bookingdates, initialBookingData.bookingdates);
    assert.strictEqual(body.booking.additionalneeds, initialBookingData.additionalneeds);

    createdBookingId = body.bookingid;
  });

  it('Scenario 3: Get created booking by id', async () => {
    assert.ok(createdBookingId);

    const response = await getBookingById(createdBookingId);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.ok, true);

    assert.ok(response.headers.has('content-type'));
    assert.match(response.headers.get('content-type'), /application\/json/);

    const body = await response.json();
    assert.strictEqual(body.firstname, initialBookingData.firstname);
    assert.strictEqual(body.lastname, initialBookingData.lastname);
    assert.strictEqual(body.totalprice, initialBookingData.totalprice);
    assert.strictEqual(body.depositpaid, initialBookingData.depositpaid);
    assert.deepStrictEqual(body.bookingdates, initialBookingData.bookingdates);
    assert.strictEqual(body.additionalneeds, initialBookingData.additionalneeds);
  });

  it('Scenario 4: Update booking using token', async () => {
    assert.ok(createdBookingId);
    assert.ok(authToken);

    const response = await updateBooking(createdBookingId, updatedBookingData, authToken);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.ok, true);

    assert.ok(response.headers.has('content-type'));
    assert.match(response.headers.get('content-type'), /application\/json/);

    const body = await response.json();
    assert.strictEqual(body.firstname, updatedBookingData.firstname);
    assert.strictEqual(body.lastname, updatedBookingData.lastname);
    assert.strictEqual(body.totalprice, updatedBookingData.totalprice);
    assert.strictEqual(body.depositpaid, updatedBookingData.depositpaid);
    assert.deepStrictEqual(body.bookingdates, updatedBookingData.bookingdates);
    assert.strictEqual(body.additionalneeds, updatedBookingData.additionalneeds);
  });

  it('Scenario 5: Remove booking', async () => {
    assert.ok(createdBookingId);
    assert.ok(authToken);

    const deleteResponse = await deleteBooking(createdBookingId, authToken);

    assert.strictEqual(deleteResponse.status, 201);
    assert.ok(deleteResponse.headers.has('content-type'));

    const deleteBodyText = await deleteResponse.text();
    assert.strictEqual(deleteBodyText, 'Created');

    const verifyResponse = await getBookingById(createdBookingId);

    assert.strictEqual(verifyResponse.status, 404);
    assert.strictEqual(verifyResponse.ok, false);
    assert.ok(verifyResponse.headers.has('content-type'));

    const verifyBodyText = await verifyResponse.text();
    assert.strictEqual(verifyBodyText, 'Not Found');
  });
});
