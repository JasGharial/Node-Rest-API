import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

type createUserType = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'access_token' | 'password_hashed'>

const superAdminCredentials: createUserType = {
  first_name: "Super",
  last_name: "Admin",
  email: "super-admin@yopmail.com",
  role: "SUPER_ADMIN",

}

const main = async () => {
  await createSuperUser
}

main().catch((err) => {
    console.log(err);
    process.exit(1);
}).finally(async () => {
    prisma.$disconnect();
});

const createSuperUser = async () => {

}
