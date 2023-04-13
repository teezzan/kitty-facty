import { SortOrder } from "./constants";
/**
 * Arguments required for getting cat facts from API
 */
export type CatFactAPIArgs = {
  limit: number;
  page: number;
  maxLength: number;
  sortByLength: SortOrder | null;
  sortByAlphabet: SortOrder | null;
};

/**
 * Query strings allowed by Next.js API routes
 */
export type NextAPIQueryStrings = Partial<{
  [key: string]: string | string[];
}>;

/**
 * A cat fact object returned by the API
 */
export type Fact = {
  id?: Number;
  fact: String;
  length: Number;
};

/**
 * Data object returned by the cat fact API
 */
export type CatFactData = {
  currentPage: number;
  perPage: number;
  totalPages: number;
  facts: Fact[];
};

/**
 * Response object returned by the cat fact API
 */
export type CatFactAPIResponse = {
  data: CatFactData;
  isError: boolean;
};

/**
 * Object representing an error in the API response
 */
export type APIError = {
  error: string;
};
