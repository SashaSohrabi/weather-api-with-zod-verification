import z from 'zod';

import { WeatherSchema } from '../schemas/WeatherSchemas';

export type Weather = z.infer<typeof WeatherSchema>;