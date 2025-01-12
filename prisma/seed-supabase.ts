// prisma/seed-supabase.ts
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Required environment variables:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
    key: process.env.SUPABASE_SERVICE_KEY ? 'Present' : 'Missing'
  })
  throw new Error('Missing required Supabase environment variables')
}

// Initialize Supabase client with the correct env variable name
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // Changed from SUPABASE_SERVICE_ROLE_KEY to SUPABASE_SERVICE_KEY
)

async function createSupabaseUser(email: string, password: string) {
  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    throw new Error(`Failed to create Supabase user: ${error.message}`)
  }

  return user.user
}

async function mainSupabase() {
  

  // Create users in Supabase first
  await createSupabaseUser('superadmin@snapfood.com', 'super123')
  await createSupabaseUser('admin@snapfood.com', 'admin123')
  await createSupabaseUser('manager@snapfood.com', 'manager123')
  await createSupabaseUser('owner@snapfood.com', 'owner123')
  await createSupabaseUser('staff@snapfood.com', 'staff123')

  
}

mainSupabase()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })