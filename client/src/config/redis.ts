import { Redis } from '@upstash/redis'

export const redisClient = new Redis({
  url: 'https://driving-ocelot-61211.upstash.io',
  token: 'Ae8bAAIjcDFjMGI1ZGNkMTBiMWI0ZTYwOGUzZTlmZTc1YzQ3Y2I3YnAxMA',
})