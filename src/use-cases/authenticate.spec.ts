import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('authenticate user', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@acme.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@acme.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('not authenticate, inexistent user', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@acme.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('not authenticate, wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@acme.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@acme.com',
        password: 'wrong password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
