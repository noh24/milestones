import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.user.deleteMany({})
  await prisma.profile.deleteMany({})
  
  const allUsers = await prisma.user.findMany({
    include: {
      milestones: true,
      profile: true,
    }
  })
  const milestones = await prisma.milestone.findMany({})
  const profiles = await prisma.profile.findMany({})

  console.dir(allUsers, { depth: null })
  console.dir(milestones, { depth: null })
  console.dir(profiles, { depth: null })
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