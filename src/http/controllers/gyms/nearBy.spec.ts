import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('Search gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('list near by gyms', async () => {
    const { token } = await createAndAuthUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'far',
        description: '',
        phone: '',
        latitude: -27.0747279,
        longitude: -49.4889672,
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'near',
        description: '',
        phone: '',
        latitude: -27.2092052,
        longitude: -49.6401891,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -27.2092052,
        longitude: -49.6401891,
      })
      .set('Authorization', `bearer ${token}`)
      .send()

    console.log(response.body)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'near',
      }),
    ])
  })
})
