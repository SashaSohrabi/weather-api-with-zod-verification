import { useActionState, useId, useState } from 'react';
import type { Weather } from './types';
import { WeatherSchema } from './schemas/WeatherSchemas';

const key = import.meta.env.VITE_API_KEY;

import './App.css';

type WeatherActionState = {
  data: Weather | null;
  error: string | null;
};

const initialState: WeatherActionState = {
  data: null,
  error: null,
};

async function weatherAction(
  _prevState: WeatherActionState,
  formData: FormData
): Promise<WeatherActionState> {
  const rawData = Object.fromEntries(formData);
  const city = rawData.city as string;

  if (!key) {
    return { data: null, error: 'Weather API key is missing.' };
  }

  try {
    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=${key}&query=${city}`
    );

    if (!response.ok) {
      return {
        data: null,
        error: `Weather service error (${response.status}).`,
      };
    }

    const payload: unknown = await response.json();

    if (payload && typeof payload === 'object' && 'error' in payload) {
      type WeatherApiError = { code?: number; type?: string; info?: unknown };
      const serviceError = (payload as { error?: WeatherApiError }).error;
      const info =
        serviceError && typeof serviceError.info === 'string'
          ? serviceError.info
          : 'Weather service returned an unexpected error.';
      return { data: null, error: info };
    }

    const parsed = WeatherSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        data: null,
        error: 'Received weather data in an unexpected format.',
      };
    }

    return { data: parsed.data, error: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error while fetching weather.';
    return { data: null, error: message };
  }
}

function App() {
  const cityId = useId();
  const [city, setCity] = useState('');
  const [state, action, pending] = useActionState(weatherAction, initialState);
  const isSubmitDisabled = pending || !city.trim();

  return (
    <>
      <h1>Type your city to get the weather</h1>

      <form
        action={action}
        onSubmit={() => setCity('')}
        style={{
          marginTop: '20px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        <label htmlFor={cityId} style={{ textAlign: 'left', fontSize: '30px' }}>
          City
        </label>
        <input
          type="text"
          name="city"
          id={cityId}
          value={city}
          style={{ width: '70%', height: '30px' }}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          type="submit"
          style={{ width: '70%' }}
          disabled={isSubmitDisabled}
        >
          {pending ? 'Loading...' : 'Get Weather'}
        </button>

        {state.error && (
          <p role="alert" style={{ color: 'red', marginTop: '-10px' }}>
            {state.error}
          </p>
        )}

        {state.data && (
          <section style={{ width: '70%', textAlign: 'left' }}>
            <h2 style={{ marginBottom: '10px' }}>
              {state.data.location.name}, {state.data.location.country}
            </h2>
            <p style={{ marginBottom: '4px' }}>
              {state.data.current.temperature}°C —{' '}
              {state.data.current.weather_descriptions.join(', ')}
            </p>
            <p style={{ marginBottom: '4px' }}>
              Feels like {state.data.current.feelslike}°C. Humidity{' '}
              {state.data.current.humidity}%.
            </p>
            <p style={{ marginBottom: '0' }}>
              Wind {state.data.current.wind_speed} km/h{' '}
              {state.data.current.wind_dir}.
            </p>
          </section>
        )}
      </form>
    </>
  );
}

export default App;
