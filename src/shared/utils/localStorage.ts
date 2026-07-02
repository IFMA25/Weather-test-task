import { Coordinates } from "../types/storage";

export const setToLocalStorage = (key: string, value: Coordinates | Coordinates[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);

  if (!value) return null;

  return JSON.parse(value);
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const removeCoordinateFromLocalStorage = (
  key: string,
  lat: number,
  lon: number,
) => {
  const value = localStorage.getItem(key);

  if (!value) return;

  const coordinates: Coordinates[] = JSON.parse(value);

  const updatedCoordinates: Coordinates[] = coordinates.filter(
    (coordinate) => !(coordinate.lat === lat && coordinate.lon === lon),
  );

  localStorage.setItem(key, JSON.stringify(updatedCoordinates));
};

export const addCoordinateToLocalStorage = (
  key: string,
  coordinateToAdd: Coordinates,
) => {
  const value = localStorage.getItem(key);

  const parsed = value ? JSON.parse(value) : [];
  const coordinates: Coordinates[] = Array.isArray(parsed) ? parsed : [parsed];

  coordinates.push(coordinateToAdd);

  localStorage.setItem(key, JSON.stringify(coordinates));
};
