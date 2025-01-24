import { z } from 'zod';
import { TravelPlannerProps } from './travel-planner.types';

export const TravelPlannerSchema: z.ZodType<TravelPlannerProps> = z.object({
  destination: z
    .string()
    .min(1, { message: 'Destination is required' })
    .max(255, { message: 'Destination must be less than 255 characters' }),
  travel: z.string().refine((val) => val !== null, {
    message: 'Travel planning selection is required',
  }),
  budget: z
    .string()
    .refine((val) => val !== null, { message: 'Budget selection is required' }),
  activities: z
    .array(z.string())
    .min(1, { message: 'At least one activity must be selected' }),
});

export type TravelPlannerType = z.infer<typeof TravelPlannerSchema>;
