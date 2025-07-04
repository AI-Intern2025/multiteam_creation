import { db, users } from '../src/db'

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...')
    
    // Clear existing users
    await db.delete(users)
    console.log('✅ Cleared existing users')
    
    // Insert admin and regular users
    const seedUsers = [
      {
        email: 'admin@dream11.com',
        password: 'admin123', // In production, this should be hashed
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'user@dream11.com',
        password: 'user123', // In production, this should be hashed
        name: 'Regular User',
        role: 'user'
      },
      {
        email: 'john@example.com',
        password: 'john123', // In production, this should be hashed
        name: 'John Doe',
        role: 'user'
      },
      {
        email: 'sarah@example.com',
        password: 'sarah123', // In production, this should be hashed
        name: 'Sarah Johnson',
        role: 'user'
      }
    ]
    
    const insertedUsers = await db.insert(users).values(seedUsers).returning()
    
    console.log('✅ Users seeded successfully:')
    insertedUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user.id}`)
    })
    
    console.log('\n🎉 User seeding completed!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    process.exit(1)
  }
}

seedUsers()
