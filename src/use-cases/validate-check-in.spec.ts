import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { LateCheckInError } from './errors/late-check-in-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should validate a check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym01',
      user_id: 'testuser',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validate_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validate_at).toEqual(expect.any(Date))
  })

  it('should not validate inexistent check in', async () => {
    await expect(
      sut.execute({
        checkInId: 'inxstent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not validate a check in after 20 min of its creation', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0))
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym01',
      user_id: 'testuser',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInError)
  })
})
