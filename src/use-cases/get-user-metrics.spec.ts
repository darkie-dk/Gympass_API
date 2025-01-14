import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Fetch user check-ins History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get user check-ins count', async () => {
    await checkInsRepository.create({
      gym_id: 'gym01',
      user_id: 'testuser',
    })

    await checkInsRepository.create({
      gym_id: 'gym02',
      user_id: 'testuser',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'testuser',
    })

    expect(checkInsCount).toEqual(2)
  })
})
