import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.user.delete({
    where: {
      id: 1
    }
  })
  
  const allUsers = await prisma.user.findMany({
    include: {
      milestones: true,
      profile: true,
    }
  })
  const milestones = await prisma.milestone.findMany({})

  console.dir(allUsers, { depth: null })
  console.dir(milestones, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })