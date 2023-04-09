export type CatFactAPIArgs = {
  limit: number;
  page: number;
};

export type NextAPIQueryStrings = Partial<{
  [key: string]: string | string[];
}>;

export type Fact = {
  id: Number;
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
  data: CatFactData | null;
  isError: boolean;
};

export type APIError = {
  error: string;
};
