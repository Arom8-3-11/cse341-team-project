import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const bookingForm = {
  scheduleId: '1',
  tripId: 'alpine-panorama',
  ticketClass: 'premium',
  selectedDay: 'monday',
  'passengers[0][firstName]': 'Yuki',
  'passengers[0][lastName]': 'Tanaka',
  'passengers[0][email]': 'yuki.tanaka@example.com',
  'passengers[0][phone]': '+81 120-555-1234'
};

describe('POST /trips/book', () => {
  test('creates a booking and redirects to the confirmation page', async () => {
    const response = await request(app).post('/trips/book').type('form').send(bookingForm);

    expect(response.status).toBe(302);
    expect(response.headers.location).toMatch(/^\/trips\/confirmation\/JR/);

    const bookingId = response.headers.location.split('/').pop();
    const confirmation = await request(app).get(`/trips/confirmation/${bookingId}`);

    expect(confirmation.status).toBe(200);
    expect(confirmation.text).toContain(bookingId);
    expect(confirmation.text).toContain('Yuki');
  });
});

describe('GET /api/bookings', () => {
  test('returns an empty array when there are no bookings', async () => {
    const response = await request(app).get('/api/bookings');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual([]);
  });

  test('returns created bookings', async () => {
    const created = await request(app).post('/trips/book').type('form').send(bookingForm);
    const bookingId = created.headers.location.split('/').pop();

    const response = await request(app).get('/api/bookings');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: bookingId,
      scheduleId: 1,
      tripId: 'alpine-panorama',
      ticketClass: 'premium',
      selectedDay: 'monday'
    });
    expect(response.body[0].passengers).toHaveLength(1);
  });
});

describe('GET /bookings-admin', () => {
  test('renders the bookings admin page shell', async () => {
    const response = await request(app).get('/bookings-admin');

    expect(response.status).toBe(200);
    expect(response.text).toContain('booking-card-template');
  });
});
