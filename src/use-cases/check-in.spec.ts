import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { FarFromGymError } from './errors/far-from-gym'
import { OutOfCheckInsForToday } from './errors/out-of-check-ins-today'

let checkInsRepository: InMemoryCheckInsRepository
let GymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    GymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, GymsRepository)

    vi.useFakeTimers()

    await GymsRepository.create({
      id: 'gym a',
      title: 'solid gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user a',
      gymId: 'gym a',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user a',
      gymId: 'gym a',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        userId: 'user a',
        gymId: 'gym a',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(OutOfCheckInsForToday)
  })

  it('should be able to check in twice in != days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user a',
      gymId: 'gym a',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user a',
      gymId: 'gym a',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    GymsRepository.items.push({
      id: 'gym b',
      title: 'solid gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(async () => {
      await sut.execute({
        userId: 'user a',
        gymId: 'gym b',
        userLatitude: -27.2092052,
        userLongitude: -49.6401891,
      })
    }).rejects.toBeInstanceOf(FarFromGymError)
  })
})
