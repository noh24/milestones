import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const milestone = await prisma.milestone.update({
    where: { id: 1 },
    data: { content: 'first database entry and update'},
  })
  // await prisma.user.create({
  //   data: {
  //     name: 'dummy',
  //     email: 'dummy@test.com',
  //     password: 'abc123',
  //     milestones: {
  //       create: {
  //         title: 'my first prisma connection with next js',
  //         content: 'omg, i finally connected a database on nextjs'
  //       },
  //     },
  //     profile: {
  //       create: {
  //         profession: 'swe bro'
  //       },
  //     },
  //   },
  // })

  const allUsers = await prisma.user.findMany({
    include: {
      milestones: true,
      profile: true,
    }
  })
  console.dir(allUsers, { depth: null})
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