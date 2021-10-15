import { LieuDit } from 'src/app/model/graphql';

export const getLieuxDitsCoordinates = (lieudit: Pick<LieuDit, 'latitude' | 'longitude'>): [number, number] => {
  return [lieudit.latitude, lieudit.longitude];
}
