import prisma from "@/prisma/db"
import { MilestoneFormData } from "@/types/types"

export default class CustomPrisma {
  static async updateMilestoneWithDocument(milestoneData: MilestoneFormData, documentPath: string) {
    return await prisma.milestone.update({
      where: {
        id: milestoneData.id
      },
      data: {
        title: milestoneData.title,
        content: milestoneData.content,
        type: milestoneData.type,
        date: milestoneData.date,
        document: documentPath
      },
    })
  }

  static async updateMilestoneWithoutDocument(milestoneData: MilestoneFormData) {
    return await prisma.milestone.update({
      where: {
        id: milestoneData.id
      },
      data: {
        title: milestoneData.title,
        content: milestoneData.content,
        type: milestoneData.type,
        date: milestoneData.date,
      },
    })
  }

}