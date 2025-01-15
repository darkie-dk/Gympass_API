import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { createGym } from './create'
import { searchGyms } from './search'
import { fetchNearBy } from './nearBy'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms/search', searchGyms)
  app.get('/gyms/nearby', fetchNearBy)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
}
