import prisma from "@/prisma/db"
import { EditMilestoneFormData } from "@/types/types"

export default class CustomPrisma {
  static async updateMilestoneWithDocument(milestoneData: EditMilestoneFormData, documentPath: string) {
    return await prisma.milestone.update({
      where: {
        id: milestoneData.id
      },
      data: {
        title: milestoneData.title,
        content: milestoneData.content,
        type: milestoneData.type,
        date: milestoneData.date,
        documentPath: documentPath
      },
    })
  }

  static async updateMilestoneWithoutDocument(milestoneData: EditMilestoneFormData) {
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