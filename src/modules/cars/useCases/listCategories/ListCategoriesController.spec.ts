import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hash } from 'bcrypt';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create category controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS (id, name, email, password, "isAdmin", driver_license, created_at)
        VALUES ('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'XXX-XXXX', 'now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { token } = responseToken.body;

    await request(app)
      .get('/categories')
      .send({
        name: 'Category supertest',
        description: 'Category supertest description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].name).toEqual('Category supertest');
  });
});
