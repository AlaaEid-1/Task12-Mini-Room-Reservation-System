import { z } from 'zod';

export const CreateBookingSchema = z
  .object({
    roomId: z.string().min(1, 'Room ID is required'),
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
  })
  .refine(data => new Date(data.checkInDate) < new Date(data.checkOutDate), {
    message: 'Check-in date must be before check-out date',
    path: ['checkOutDate'],
  });

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof UpdateBookingStatusSchema
>;
