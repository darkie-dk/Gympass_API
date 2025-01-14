import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
  constructor(private CheckInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.CheckInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
