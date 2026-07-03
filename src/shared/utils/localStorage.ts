import { Coordinates } from "../types/storage";

export const setToLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);

  if (!value) return null;

  return JSON.parse(value) as T;
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const removeCoordinateFromLocalStorage = (
  key: string,
  lat: number,
  lon: number,
) => {
  const coordinates = getFromLocalStorage<Coordinates[]>(key) || [];

  const updatedCoordinates = coordinates.filter(
    (coordinate) => !(coordinate.lat === lat && coordinate.lon === lon),
  );

  setToLocalStorage(key, updatedCoordinates);
};

export const addCoordinateToLocalStorage = (
  key: string,
  coordinateToAdd: Coordinates,
) => {
  const coordinates = getFromLocalStorage<Coordinates[]>(key) || [];

  coordinates.push(coordinateToAdd);

  setToLocalStorage(key, coordinates);
};
