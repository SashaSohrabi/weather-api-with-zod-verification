import z from 'zod';

const RequestSchema = z.object({
  type: z.string(),
  query: z.string(),
  language: z.string(),
  unit: z.string(),
});

const LocationSchema = z.object({
  name: z.string(),
  country: z.string(),
  region: z.string(),
  lat: z.string(),
  lon: z.string(),
  timezone_id: z.string(),
  localtime: z.string(),
  localtime_epoch: z.number(),
  utc_offset: z.string(),
});

export const WeatherSchema = z.object({
  request: RequestSchema,
  location: LocationSchema,
  current: z.object({
    observation_time: z.string(),
    temperature: z.number(),
    weather_code: z.number(),
    weather_icons: z.array(z.string()),
    weather_descriptions: z.array(z.string()),
    astro: z.object({
      sunrise: z.string(),
      sunset: z.string(),
      moonrise: z.string(),
      moonset: z.string(),
      moon_phase: z.string(),
      moon_illumination: z.number(),
    }),
    air_quality: z.object({
      co: z.string(),
      no2: z.string(),
      o3: z.string(),
      so2: z.string(),
      pm2_5: z.string(),
      pm10: z.string(),
      'us-epa-index': z.string(),
      'gb-defra-index': z.string(),
    }),
    wind_speed: z.number(),
    wind_degree: z.number(),
    wind_dir: z.string(),
    pressure: z.number(),
    precip: z.number(),
    humidity: z.number(),
    cloudcover: z.number(),
    feelslike: z.number(),
    uv_index: z.number(),
    visibility: z.number(),
    is_day: z.string(),
  }),
});
