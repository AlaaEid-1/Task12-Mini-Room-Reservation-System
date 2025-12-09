import { Prisma, PrismaClient, BookingStatus } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function seedBooking(
  guests: {
    guest1: { id: bigint };
    guest2: { id: bigint };
  },
  rooms: {
    room1: { id: bigint };
    room2: { id: bigint };
  }
) {
  console.log('Seeding Bookings');

  const today = new Date();

  const booking1CheckIn = new Date(today);
  booking1CheckIn.setDate(today.getDate() + 7);
  const booking1CheckOut = new Date(booking1CheckIn);
  booking1CheckOut.setDate(booking1CheckOut.getDate() + 5);

  const booking1 = await prisma.booking.create({
    data: {
      roomId: rooms.room1.id,
      guestId: guests.guest1.id,
      checkInDate: booking1CheckIn,
      checkOutDate: booking1CheckOut,
      totalPrice: new Prisma.Decimal(250 * 5),
      status: BookingStatus.CONFIRMED,
    },
  });

  const booking2CheckIn = new Date(today);
  booking2CheckIn.setDate(today.getDate() + 15);
  const booking2CheckOut = new Date(booking2CheckIn);
  booking2CheckOut.setDate(booking2CheckOut.getDate() + 3);

  const booking2 = await prisma.booking.create({
    data: {
      roomId: rooms.room2.id,
      guestId: guests.guest2.id,
      checkInDate: booking2CheckIn,
      checkOutDate: booking2CheckOut,
      totalPrice: new Prisma.Decimal(150 * 3),
      status: BookingStatus.PENDING,
    },
  });

  return { booking1, booking2 };
}
