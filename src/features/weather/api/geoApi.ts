import axios from "axios";

import { IpGeoResponseDto, UserGeoLocationDto } from "../types";

export const getUserLocationByIp = async (): Promise<UserGeoLocationDto> => {
  const { data } = await axios.get<IpGeoResponseDto>(
    import.meta.env.VITE_IP_URL,
  );

  if (data.latitude == null || data.longitude == null) {
    throw new Error("Failed to determine user location");
  }
  return {
    lat: data.latitude,
    lon: data.longitude,
  };
};
