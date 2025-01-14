import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('user registering', async () => {
    const { user } = await sut.execute({
      name: 'john Doe',
      email: 'johndoe@acme.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('hashing user password', async () => {
    const { user } = await sut.execute({
      name: 'john Doe',
      email: 'johndoe@acme.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('cant register twice with same email', async () => {
    const email = 'johndoe@acme.com'

    await sut.execute({
      name: 'john Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'john Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
