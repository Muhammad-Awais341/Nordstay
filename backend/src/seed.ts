// backend/src/seed.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const uniq = (arr: string[]) => Array.from(new Set(arr))

async function main() {
  // Rensa
  await prisma.booking.deleteMany().catch(() => {})
  await prisma.listing.deleteMany().catch(() => {})

  // Host – används som värd för alla annonser
  const host = await prisma.user.upsert({
    where: { email: "host@example.com" },
    update: {},
    create: {
      name: "Nordstay Host",
      email: "host@example.com",
      passwordHash: "demo1234", // matchar inte login, bara för host
      role: "host" as any,
    },
  })

  // ✅ DEMO-ANVÄNDARE (du loggar in med detta konto)
  await prisma.user.upsert({
    where: { email: "demo@user.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@user.com",
      passwordHash: "test1234", // 🔴 exakt detta används vid login
      role: "user" as any,
    },
  })

  // ====== Bilder ======
  const APT_STHLM = uniq([
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
  ])
  const OFF_STHLM = uniq([
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80",
  ])

  const APT_PARIS_EIFFEL = uniq([
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
  ])
  const OFF_PARIS = uniq([
    "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1600&q=80",
  ])

  const APT_LONDON = uniq([
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505691723518-36aef9ccfd43?auto=format&fit=crop&w=1600&q=80",
  ])
  const OFF_LONDON = uniq([
    "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1507209696998-3c532be9b2b1?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  ])

  const APT_CPH = uniq([
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
  ])
  const OFF_CPH = uniq([
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1600&q=80",
  ])

  // ====== Listings ======
  await prisma.listing.createMany({
    data: [
      {
        title: "Modern lägenhet vid Strandvägen",
        description: "Skandinavisk tvåa med balkong och ljus öppen planlösning.",
        city: "Stockholm",
        address: "Strandvägen 45",
        pricePerNight: 1650,
        maxGuests: 2,
        images: APT_STHLM,
        hostId: host.id,
      },
      {
        title: "Kontor Hötorget – mötesrum & lounge",
        description: "Ljust citykontor med plats för 12–15 personer.",
        city: "Stockholm",
        address: "Sveavägen 12",
        pricePerNight: 3600,
        maxGuests: 15,
        images: OFF_STHLM,
        hostId: host.id,
      },
      {
        title: "Studio nära Eiffeltornet",
        description: "Charmig parisisk studio med fransk balkong.",
        city: "Paris",
        address: "Avenue de Suffren 22",
        pricePerNight: 2250,
        maxGuests: 2,
        images: APT_PARIS_EIFFEL,
        hostId: host.id,
      },
      {
        title: "Kontor nära Champs-Élysées",
        description: "Elegant ljus kontorsyta – perfekt för litet team.",
        city: "Paris",
        address: "Rue de Rivoli 10",
        pricePerNight: 4300,
        maxGuests: 12,
        images: OFF_PARIS,
        hostId: host.id,
      },
      {
        title: "Hyde Park Apartment",
        description: "Stilren lägenhet med balkong och modernt kök.",
        city: "London",
        address: "Kensington Road 21",
        pricePerNight: 2850,
        maxGuests: 3,
        images: APT_LONDON,
        hostId: host.id,
      },
      {
        title: "City of London – rymligt kontor",
        description: "Öppen planlösning, konferensrum och skyline-vy.",
        city: "London",
        address: "Bishopsgate 55",
        pricePerNight: 5200,
        maxGuests: 25,
        images: OFF_LONDON,
        hostId: host.id,
      },
      {
        title: "Scandinavian Design Apartment",
        description: "Ljus lägenhet nära Nyhavn med kanalutsikt.",
        city: "Copenhagen",
        address: "Store Strandstræde 8",
        pricePerNight: 1850,
        maxGuests: 3,
        images: APT_CPH,
        hostId: host.id,
      },
      {
        title: "Minimalistiskt coworking i centrum",
        description: "Modern kontorsmiljö med mycket dagsljus och flexplatser.",
        city: "Copenhagen",
        address: "Bredgade 18",
        pricePerNight: 3150,
        maxGuests: 20,
        images: OFF_CPH,
        hostId: host.id,
      },
    ],
  })

  console.log("✅ Seed klar: demo@user.com/test1234 + 8 Nordstay-listor.")
}

main().catch(console.error).finally(async () => prisma.$disconnect())
