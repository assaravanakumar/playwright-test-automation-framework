const { test, expect } = require('../../fixtures/apiFixtures');
const payloads = require('../../data/posts.json');

test.describe('Posts API (CRUD)', () => {
  test('GET /posts returns a non-empty collection', async ({ apiContext }) => {
    const response = await apiContext.get('/posts');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toEqual(
      expect.objectContaining({ id: expect.any(Number), title: expect.any(String) })
    );
  });

  test('GET /posts/1 returns a single resource with the expected shape', async ({ apiContext }) => {
    const response = await apiContext.get('/posts/1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        id: 1,
        userId: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      })
    );
  });

  test('GET /posts/999999 returns 404 for a non-existent resource', async ({ apiContext }) => {
    const response = await apiContext.get('/posts/999999');
    expect(response.status()).toBe(404);
  });

  for (const payload of payloads) {
    test(`POST /posts creates a resource for payload titled "${payload.title}"`, async ({
      apiContext,
    }) => {
      const response = await apiContext.post('/posts', { data: payload });
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toEqual(expect.objectContaining(payload));
      expect(body.id).toEqual(expect.any(Number));
    });
  }

  test('PUT /posts/1 updates an existing resource', async ({ apiContext }) => {
    const updated = { id: 1, title: 'updated title', body: 'updated body', userId: 1 };
    const response = await apiContext.put('/posts/1', { data: updated });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual(expect.objectContaining(updated));
  });

  test('DELETE /posts/1 removes a resource', async ({ apiContext }) => {
    const response = await apiContext.delete('/posts/1');
    expect(response.status()).toBe(200);
  });

  test('full lifecycle: create, then read, then update, then delete', async ({ apiContext }) => {
    const created = await (
      await apiContext.post('/posts', { data: payloads[0] })
    ).json();
    expect(created.id).toBeDefined();

    const fetched = await apiContext.get('/posts/1');
    expect(fetched.status()).toBe(200);

    const updated = await apiContext.put('/posts/1', {
      data: { ...payloads[0], id: 1, title: 'lifecycle update' },
    });
    expect((await updated.json()).title).toBe('lifecycle update');

    const deleted = await apiContext.delete('/posts/1');
    expect(deleted.status()).toBe(200);
  });
});
