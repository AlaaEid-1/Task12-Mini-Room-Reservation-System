import { z } from 'zod';

export const CreateRoomSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  pricePerNight: z.number().positive('Price must be positive'),
  maxGuests: z.number().int().positive('Max guests must be a positive integer'),
  location: z.string().optional(),
});

export const UpdateRoomSchema = CreateRoomSchema.partial();

export const GetAvailableRoomsSchema = z.object({
  checkInDate: z.string().datetime().optional(),
  checkOutDate: z.string().datetime().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minCapacity: z.number().optional(),
});

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomSchema>;
export type GetAvailableRoomsInput = z.infer<typeof GetAvailableRoomsSchema>;
