const request = require('supertest');

// Mock db.raw so the health endpoint tests deterministically
jest.mock('../src/config/db', () => ({
  raw: jest.fn().mockResolvedValue([[{ 1: 1 }]])
}));

const app = require('../src/app');

describe('Health Check API', () => {
  it('GET /api/v1/health should return 200 and db connected status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        status: 'ok',
        db: 'connected'
      }
    });
  });
});
