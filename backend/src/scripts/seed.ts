import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ValidIdea.com' },
    update: {},
    create: {
      email: 'admin@ValidIdea.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      credits: 100,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: userPassword,
      name: 'Demo User',
      role: 'USER',
      credits: 10,
    },
  });

  console.log('Created demo user:', user.email);

  // Create sample idea
  const idea = await prisma.idea.create({
    data: {
      title: 'AI-Powered Recipe Generator',
      oneLiner: 'Generate personalized recipes based on dietary restrictions and available ingredients',
      description: 'An AI-powered mobile app that helps users create personalized recipes based on their dietary restrictions, available ingredients, and cooking skill level. The app uses computer vision to identify ingredients from photos and suggests recipes that match user preferences.',
      userId: user.id,
      status: 'DRAFT',
    },
  });

  console.log('Created sample idea:', idea.title);

  console.log('Seeding completed!');
  console.log('\nDemo credentials:');
  console.log('Admin: admin@ValidIdea.com / admin123');
  console.log('User: demo@example.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

