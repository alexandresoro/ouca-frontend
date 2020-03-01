import { CoordinatesSystemType } from "ouca-common/coordinates-system";
import { Coordinates } from "ouca-common/coordinates.object";

export const buildCoordinates = (
  system: CoordinatesSystemType,
  longitude: number,
  latitude: number
): Partial<Record<CoordinatesSystemType, Coordinates>> => {
  const coordinates: Partial<Record<CoordinatesSystemType, Coordinates>> = {};
  coordinates[system] = {
    longitude: longitude,
    latitude: latitude,
    system: system,
    isTransformed: false
  };
  return coordinates;
};
