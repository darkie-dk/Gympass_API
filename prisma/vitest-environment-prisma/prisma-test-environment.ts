import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Provide Database url environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}
export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const dabaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = dabaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
  transformMode: 'ssr',
}

// postgresql://docker:docker@localhost:5432/apisolid?schema=public
