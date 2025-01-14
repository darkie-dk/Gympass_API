import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists'

interface registerUseCaseRequest {
  name: string
  email: string
  password: string
}

interface registerUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: registerUseCaseRequest): Promise<registerUseCaseResponse> {
    const password_hash = await hash(password, 4)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
