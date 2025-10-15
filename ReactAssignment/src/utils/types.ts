export interface FieldData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: string | null;
  date_end: string | null;
}

export interface PageChangeEvent {
  first: number;
  rows: number;
  page?: number;
  pageCount?: number;
}
