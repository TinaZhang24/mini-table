const prisma = require("../prisma");
const seed = async () => {
  // A loop must be used because `prisma.restaurant.createMany` fails here
  for (let i = 0; i < 3; i++) {
    // For each restaurant, create an array of 5 reservations
    const reservations = [];
    for (let j = 0; j < 5; j++) {
      reservations.push({
        name: `Person ${i}${j}`,
        email: `${i}${j}@foo.bar`,
        partySize: Math.floor(Math.random() * 10) + 1,
      });
    }

    // Create a single restaurant with nested reservations
    await prisma.restaurant.create({
      data: {
        name: `Restaurant ${i + 1}`,
        reservations: {
          create: reservations,
        },
      },
    });
  }
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
