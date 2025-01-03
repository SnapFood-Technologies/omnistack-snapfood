// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

async function main() {
    // Create superadmin (highest level)
    const superadminPassword = await bcrypt.hash('super123', 12)
    const superadmin = await prisma.user.upsert({
        where: { email: 'superadmin@snapfood.com' },
        update: {},
        create: {
            email: 'superadmin@snapfood.com',
            name: 'Super Admin',
            password: superadminPassword,
            role: 'SUPERADMIN',
        },
    })

    // Create admin (manages all restaurants)
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@snapfood.com' },
        update: {},
        create: {
            email: 'admin@snapfood.com',
            name: 'Admin',
            password: adminPassword,
            role: 'ADMIN',
        },
    })

    // Create account manager (manages specific restaurants)
    const accountManagerPassword = await bcrypt.hash('manager123', 12)
    const accountManager = await prisma.user.upsert({
        where: { email: 'manager@snapfood.com' },
        update: {},
        create: {
            email: 'manager@snapfood.com',
            name: 'Account Manager',
            password: accountManagerPassword,
            role: 'ACCOUNT_MANAGER',
        },
    })

    // Create a restaurant
    const restaurant = await prisma.restaurant.create({
        data: {
            name: 'Demo Restaurant',
            description: 'A demo restaurant',
            address: '123 Food St',
            phone: '123-456-7890',
            email: 'demo@restaurant.com',
            status: 'ACTIVE',
        },
    })

    // Create restaurant owner
    const restaurantOwnerPassword = await bcrypt.hash('owner123', 12)
    const restaurantOwner = await prisma.user.upsert({
        where: { email: 'owner@restaurant.com' },
        update: {},
        create: {
            email: 'owner@restaurant.com',
            name: 'Restaurant Owner',
            password: restaurantOwnerPassword,
            role: 'RESTAURANT_OWNER',
            restaurantId: restaurant.id,
        },
    })

    // Create restaurant staff
    const staffPassword = await bcrypt.hash('staff123', 12)
    const staff = await prisma.user.upsert({
        where: { email: 'staff@restaurant.com' },
        update: {},
        create: {
            email: 'staff@restaurant.com',
            name: 'Staff Member',
            password: staffPassword,
            role: 'RESTAURANT_STAFF',
            restaurantId: restaurant.id,
        },
    })

    console.log({ superadmin, admin, accountManager, restaurant, restaurantOwner, staff })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })