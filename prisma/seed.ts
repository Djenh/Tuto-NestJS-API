// prisma/seed.ts
import { Action, PrismaClient, Resource } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    let defaultRole = await prisma.role.findFirst({
        where: { name: "ADMIN" }
    });

    if (!defaultRole) {
        defaultRole = await prisma.role.create({
            data: {
                name: "ADMIN",
                permissions: {
                    create: [
                    {
                      resource: Resource.USERS, 
                      actions: [Action.CREATE, Action.SHOW, Action.READ, Action.UPDATE, Action.DELETE]
                    },
                    {
                      resource: Resource.SERVICES, 
                      actions: [Action.CREATE, Action.SHOW, Action.READ, Action.UPDATE, Action.DELETE]
                    },
                    {
                      resource: Resource.PICTURES, 
                      actions: [Action.CREATE, Action.SHOW, Action.READ, Action.UPDATE, Action.DELETE]
                    }
                  ],
                },
            },
        })
    }

    let simpleUserRole = await prisma.role.findFirst({
        where: { name: "USER" }
    });

    if (!simpleUserRole) {
        simpleUserRole = await prisma.role.create({
            data: {
                name: "USER",
                permissions: {
                    create: [
                    {
                      resource: Resource.USERS, 
                      actions: [Action.SHOW, Action.READ]
                    },
                    {
                      resource: Resource.SERVICES, 
                      actions: [Action.SHOW, Action.READ]
                    },
                    {
                      resource: Resource.PICTURES, 
                      actions: [Action.SHOW, Action.READ]
                    }
                  ],
                },
            },
        })
    }

  console.log('Database seeded successfully!');
  console.log(defaultRole);
  console.log(simpleUserRole);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
