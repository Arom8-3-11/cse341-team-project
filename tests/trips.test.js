import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/trips', () => {
  test('returns a successful JSON response with all trips', async () => {
    const response = await request(app).get('/api/trips');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(6);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'alpine-panorama',
          name: 'Alpine Panorama Express',
          region: 'central'
        })
      ])
    );
  });
});

describe('GET /api/trips/:id', () => {
  test('returns one trip by ID', async () => {
    const response = await request(app).get('/api/trips/coastal-breeze');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'coastal-breeze',
      name: 'Coastal Breeze Line',
      startStation: 'aomori',
      endStation: 'akita'
    });
  });

  test('returns 404 for an unknown trip ID', async () => {
    const response = await request(app).get('/api/trips/not-a-trip');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Trip not found');
  });
});
