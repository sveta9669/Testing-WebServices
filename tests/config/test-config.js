import { ApiClient } from '../../src/core/api-client.js';
import { AuthPage } from '../../src/business/pages/auth.page.js';
import { BookingPage } from '../../src/business/pages/booking.page.js';

const baseUrl = process.env.BASE_URL || 'https://restful-booker.herokuapp.com';
const apiClient = new ApiClient(baseUrl);

export const authPage = new AuthPage(apiClient);
export const bookingPage = new BookingPage(apiClient);
