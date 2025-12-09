import { seedUsers } from './user.seeds';
import { seedRooms } from './rooms.seeds';
import { seedBooking } from './booking.seeds';

async function main() {
  console.log('Starting Complete Seeding');

  const users = await seedUsers();
  const rooms = await seedRooms(users);
  await seedBooking(users, rooms);

  console.log('Seeding Completed Successfully!');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
