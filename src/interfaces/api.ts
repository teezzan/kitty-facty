import { SortOrder } from "./constants";

export type CatFactAPIArgs = {
  limit: number;
  page: number;
  maxLength: number;
  sortByLength: SortOrder | null;
  sortByAlphabet: SortOrder | null;
};

export type NextAPIQueryStrings = Partial<{
  [key: string]: string | string[];
}>;

export type Fact = {
  id?: Number;
  fact: String;
  length: Number;
};

export type CatFactData = {
  currentPage: number;
  perPage: number;
  totalPages: number;
  facts: Fact[];
};

export type CatFactAPIResponse = {
  data: CatFactData;
  isError: boolean;
};

export type APIError = {
  error: string;
};
