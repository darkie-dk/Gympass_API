import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('create a gym', async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'solid gym',
        description: '',
        phone: '',
        latitude: -27.0747279,
        longitude: -49.4889672,
      })

    expect(response.statusCode).toEqual(201)
  })
})
