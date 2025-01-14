import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'
import { prisma } from '@/lib/prisma'

describe('create check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('create a check-in', async () => {
    const { token } = await createAndAuthUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'solid gym',
        description: '',
        phone: '',
        latitude: -27.0747279,
        longitude: -49.4889672,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `bearer ${token}`)
      .send({
        latitude: -27.0747279,
        longitude: -49.4889672,
      })

    expect(response.statusCode).toEqual(201)
  })
})
