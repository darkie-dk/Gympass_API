import { FetchUserCheckInsUseCase } from '../fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeFecthUserCheckInsUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsUseCase(checkInRepository)

  return useCase
}
