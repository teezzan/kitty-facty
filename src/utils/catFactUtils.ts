import config from "@/config";
import { NextAPIQueryStrings, CatFactAPIArgs, Fact } from "@/interfaces/api";
import { SortOrder } from "@/interfaces/constants";

export const parseQueryStrings = (
  query: NextAPIQueryStrings
): CatFactAPIArgs => {
  const perPage = parseInt(query.perPage as string, 10);
  const page = parseInt(query.page as string, 10);
  const sortByLength = query.sortByLength as string;
  const sortByAlphabet = query.sortByAlphabet as string;
  const maxLength = parseInt(query.maxLength as string, 10);

  const isValidAlphabetSortOrder = Object.values(SortOrder).includes(
    sortByAlphabet as SortOrder
  );

  const isValidLengthSortOrder = Object.values(SortOrder).includes(
    sortByLength as SortOrder
  );

  return {
    limit: getPositiveNumberOrDefault(perPage, config.api.defaultFactPerPage),
    page: getPositiveNumberOrDefault(page, config.api.defaultFactPage),
    maxLength: getPositiveNumberOrDefault(
      maxLength,
      config.api.defaultFactMaxLength
    ),
    sortByLength: isValidLengthSortOrder ? (sortByLength as SortOrder) : null,
    sortByAlphabet: isValidAlphabetSortOrder
      ? (sortByAlphabet as SortOrder)
      : null,
  };
};

export const addIDToCatFacts = (
  facts: Fact[],
  currentPage: number = 1,
  limit: number = config.api.defaultFactPerPage
): Fact[] => {
  return facts.map((fact, index) => {
    const id = (currentPage - 1) * limit + index + 1;
    return {
      ...fact,
      id,
    };
  });
};

export const sortFactsAlphabetically = (
  facts: Fact[],
  sortAsc = true
): Fact[] => {
  return facts.sort((a, b) => {
    if (a.fact > b.fact) {
      return sortAsc ? 1 : -1;
    }
    if (a.fact < b.fact) {
      return sortAsc ? -1 : 1;
    }
    return 0;
  });
};

export const sortFactsByLength = (facts: Fact[], sortAsc = true): Fact[] => {
  return facts.sort((a, b) => {
    if (a.length > b.length) {
      return sortAsc ? 1 : -1;
    }
    if (a.length < b.length) {
      return sortAsc ? -1 : 1;
    }
    return 0;
  });
};

function getPositiveNumberOrDefault(
  num: number | undefined,
  fallback: number
): number {
  const parsedNum = typeof num === "number" ? num : NaN;
  if (isNaN(parsedNum) || parsedNum <= 0) {
    return fallback;
  }
  return parsedNum;
}
