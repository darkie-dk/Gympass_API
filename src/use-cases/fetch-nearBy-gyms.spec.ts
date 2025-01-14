import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearBy-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch user check-ins History Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch near by gyms', async () => {
    await gymsRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -29.0747279,
      longitude: -50.4889672,
    })

    const { gyms } = await sut.execute({
      userLatitude: -29.0747279,
      userLongitude: -50.4889672,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
