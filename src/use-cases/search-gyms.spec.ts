import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Fetch user check-ins History Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await gymsRepository.create({
      title: 'TS Gym',
      description: '',
      phone: '',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym' }),
      expect.objectContaining({ title: 'TS Gym' }),
    ])
  })

  it('should be able to seach paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym${i}`,
        description: '',
        phone: '',
        latitude: -27.0747279,
        longitude: -49.4889672,
      })
    }
    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym21' }),
      expect.objectContaining({ title: 'gym22' }),
    ])
  })
})
