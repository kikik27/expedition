import { PrismaClient } from '@prisma/client'
const fs = require('fs');
const path = require('path');


const prisma = new PrismaClient()

async function main() {
  // console.log(path.join(__dirname, 'json/provinces.json'))
  const provinces = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/provinces.json'), 'utf8'))
  const regencies = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/regencies.json'), 'utf8'))
  const districts = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/districts.json'), 'utf8'))

  await prisma.district.deleteMany()
  await prisma.regency.deleteMany()
  await prisma.province.deleteMany()

  await prisma.province.createMany({ data: provinces })
  await prisma.regency.createMany({ data: regencies })
  await prisma.district.createMany({ data: districts })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
