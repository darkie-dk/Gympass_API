import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'Johndoe@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
