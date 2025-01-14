import { expect, describe, it, beforeEach } from 'vitest'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsUseCase

describe('Fetch user check-ins History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsUseCase(checkInsRepository)
  })

  it('should be able to fetch user check-ins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym01',
      user_id: 'testuser',
    })

    await checkInsRepository.create({
      gym_id: 'gym02',
      user_id: 'testuser',
    })

    const { checkIns } = await sut.execute({
      userId: 'testuser',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym01' }),
      expect.objectContaining({ gym_id: 'gym02' }),
    ])
  })

  it('should be able to fetch paginated user check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym${i}`,
        user_id: 'testuser',
      })
    }
    const { checkIns } = await sut.execute({
      userId: 'testuser',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym21' }),
      expect.objectContaining({ gym_id: 'gym22' }),
    ])
  })
})
