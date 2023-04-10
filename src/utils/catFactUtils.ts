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
    limit: perPage || config.api.defaultFactPerPage,
    page: page || config.api.defaultFactPage,
    maxLength: maxLength || config.api.defaultFactMaxLength,
    sortByLength: isValidLengthSortOrder ? (sortByLength as SortOrder) : null,
    sortByAlphabet: isValidAlphabetSortOrder
      ? (sortByAlphabet as SortOrder)
      : null,
  };
};

export const addIDToCatFacts = (facts: Fact[]): Fact[] => {
  return facts.map((fact, index) => {
    return {
      ...fact,
      id: index + 1,
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
