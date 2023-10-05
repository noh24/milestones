import prisma from "@/prisma/db"
import { ParsedEditMilestoneFormData } from "@/types/types"

export default class CustomPrisma {
  static async updateMilestoneWithDocument(milestoneData: ParsedEditMilestoneFormData, documentPath: string) {
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

  static async updateMilestoneWithoutDocument(milestoneData: ParsedEditMilestoneFormData) {
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