import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { createGym } from './create'
import { searchGyms } from './search'
import { fetchNearBy } from './nearBy'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', createGym)
  app.get('/gyms/search', searchGyms)
  app.get('/gyms/nearby', fetchNearBy)
}
