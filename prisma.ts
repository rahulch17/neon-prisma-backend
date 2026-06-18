import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
import { prisma } from './prisma'
const companies =  await prisma.company.findMany()
console.log(companies)
