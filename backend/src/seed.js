import prisma from './lib/prismaClient.js'

async function main() {
  await prisma.listing.createMany({
    data: [
      {
        title: 'Modern lägenhet i centrala Stockholm',
        description: 'Ljus och fräsch tvåa nära Odenplan.',
        city: 'Stockholm',
        address: 'Sveavägen 100',
        pricePerNight: 1200,
        maxGuests: 2,
        images: ['https://picsum.photos/800/600?1'],
      },
      {
        title: 'Kontorslokal i Göteborg',
        description: 'Perfekt för små företag, 100 m² kontor vid avenyn.',
        city: 'Göteborg',
        address: 'Avenyn 23',
        pricePerNight: 2200,
        maxGuests: 10,
        images: ['https://picsum.photos/800/600?2'],
      },
      {
        title: 'Stuga i fjällen',
        description: 'Mysig fjällstuga med bastu och utsikt.',
        city: 'Åre',
        address: 'Fjällvägen 8',
        pricePerNight: 950,
        maxGuests: 4,
        images: ['https://picsum.photos/800/600?3'],
      },
    ],
  })
  console.log('✅ 3 demo-boenden skapade!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
