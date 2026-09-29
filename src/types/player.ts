export interface Player {
  id: string;
  name: string;
  fullName?: string;
  nationality: string;
  position: "FWD" | "MID" | "DEF" | "GK";
  unitedStartYear: number;
  unitedEndYear: number | null;
  appearances?: number;
  goals?: number;
  transferFeeMillionGBP?: number;
  /** Curated sum of endYear-startYear for each senior spell; NOT seasons. */
  unitedYears?: number;
  careerLabel?: string;
  image?: string;
  eras: string[];
  sourceIds: string[];
  dataNote?: string;
}
