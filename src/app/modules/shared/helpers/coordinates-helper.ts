import { Commune, LieuDit } from 'src/app/model/graphql';

export const getLieuxDitsCoordinates = (lieudit: LieuDit): [number, number] => {
  return [lieudit.latitude, lieudit.longitude];
}

export const getAllLieuxDitsCoordinatesOfDepartement = (lieudits: LieuDit[], communes: Commune[], departementId: number): [number, number][] => {
  const communesIdOfDepartment = communes?.filter(commune => commune.departementId === departementId)?.map(commune => commune.id) ?? [];
  return lieudits?.filter((lieudit) => {
    return communesIdOfDepartment.includes(lieudit?.communeId);
  }).map(getLieuxDitsCoordinates) ?? [];
}

export const getAllLieuxDitsCoordinatesOfCommune = (lieudits: LieuDit[], communeId: number): [number, number][] => {
  return lieudits?.filter((lieudit) => {
    return lieudit?.communeId === communeId;
  }).map(getLieuxDitsCoordinates) ?? [];
}