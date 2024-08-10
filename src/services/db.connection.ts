import { PrismaClient, Prisma } from '@prisma/client'

export class PrismaService {
  private static instance: PrismaClient

  static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: [
          {
            emit: 'event',
            level: 'query',
          },
          {
            emit: 'stdout',
            level: 'error',
          },
          {
            emit: 'stdout',
            level: 'info',
          },
          {
            emit: 'stdout',
            level: 'warn',
          },
        ],
      })
    }

    // @ts-ignore
    PrismaService.instance.$on("query", (e: Prisma.QueryEvent) => {
      console.log('Query: ' + e.query)
      console.log('Params: ' + e.params)
      console.log('Duration: ' + e.duration + 'ms')
    })

    return PrismaService.instance
  }
}
