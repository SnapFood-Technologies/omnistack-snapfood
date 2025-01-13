// prisma/seed-templates.ts
import { PrismaClient, EmailType } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Approved Template
  await prisma.emailTemplate.upsert({
    where: {
      type: EmailType.STUDENT_VERIFICATION_APPROVED
    },
    update: {
      htmlFile: "student-approved.html"
    },
    create: {
      name: "Student Verification Approved",
      type: EmailType.STUDENT_VERIFICATION_APPROVED,
      subject: "Your Student Card has been Approved! 🎉",
      htmlFile: "student-approved.html",
      isActive: true
    }
  });

  // Declined Template
  await prisma.emailTemplate.upsert({
    where: {
      type: EmailType.STUDENT_VERIFICATION_DECLINED
    },
    update: {
      htmlFile: "student-declined.html"
    },
    create: {
      name: "Student Verification Declined",
      type: EmailType.STUDENT_VERIFICATION_DECLINED,
      subject: "Student Card Verification Update",
      htmlFile: "student-declined.html",
      isActive: true
    }
  });
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })