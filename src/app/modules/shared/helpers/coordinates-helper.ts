import { Lieudit } from 'src/app/model/types/lieudit.model';
import { UILieudit } from 'src/app/models/lieudit.model';

export const getLieuxDitsCoordinates = (lieudit: Lieudit | UILieudit): [number, number] => {
  return [lieudit.coordinates.latitude, lieudit.coordinates.longitude];
}

export const getAllLieuxDitsCoordinatesOfDepartement = (lieudits: UILieudit[], departementId: number): [number, number][] => {
  return lieudits?.filter((lieudit) => {
    return lieudit?.commune?.departement?.id === departementId;
  }).map(getLieuxDitsCoordinates) ?? [];
}

export const getAllLieuxDitsCoordinatesOfCommune = (lieudits: UILieudit[], communeId: number): [number, number][] => {
  return lieudits?.filter((lieudit) => {
    return lieudit?.commune?.id === communeId;
  }).map(getLieuxDitsCoordinates) ?? [];
}