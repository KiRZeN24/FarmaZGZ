export interface AyuntamientoPharmacy {
  id: number;
  title: string;
  telefonos: string;
  calle: string;
  email?: string;
  horario?: string;
  descripcion?: string;
  url?: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  guardia: {
    fecha: string;
    turno: string;
    horario: string;
    sector: string;
  };
}

export interface AyuntamientoApiResponse {
  totalCount: number;
  start: number;
  rows: number;
  result: AyuntamientoPharmacy[];
}
