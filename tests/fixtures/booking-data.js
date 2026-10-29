export const credentials = {
  username: 'admin',
  password: 'password123',
};

export const initialBookingData = {
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

export const updatedBookingData = {
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
