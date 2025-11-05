
export interface WeightEntry {
  percentage: number;
  weight: number | string;
}

export type AllWeights = {
  [key: string]: WeightEntry[];
};
