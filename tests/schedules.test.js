import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/trips/:id/schedules', () => {
  test('returns all schedules for a trip', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama/schedules');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.every((schedule) => schedule.tripId === 'alpine-panorama')).toBe(true);
  });

  test('returns schedules when the trip operates in the requested month', async () => {
    // alpine-panorama operates April through November.
    const response = await request(app).get('/api/trips/alpine-panorama/schedules?month=5');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('returns an empty array when the trip does not operate in the requested month', async () => {
    // alpine-panorama does not operate in January.
    const response = await request(app).get('/api/trips/alpine-panorama/schedules?month=1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('returns 400 for an invalid month', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama/schedules?month=13');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('returns 404 for an unknown trip ID', async () => {
    const response = await request(app).get('/api/trips/not-a-trip/schedules');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Trip not found');
  });
});
