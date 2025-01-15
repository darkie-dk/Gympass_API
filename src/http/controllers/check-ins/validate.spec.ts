import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'
import { prisma } from '@/lib/prisma'

describe('validate check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('validate a check-in', async () => {
    const { token } = await createAndAuthUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'solid gym',
        description: '',
        phone: '',
        latitude: -27.0747279,
        longitude: -49.4889672,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: { gym_id: gym.id, user_id: user.id },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        latitude: -27.0747279,
        longitude: -49.4889672,
      })

    expect(response.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validate_at).toEqual(expect.any(Date))
  })
})
