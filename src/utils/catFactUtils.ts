import config from "@/config";
import { NextAPIQueryStrings, CatFactAPIArgs, Fact } from "@/interfaces/api";
import { SortOrder } from "@/interfaces/constants";

/**
 * Parses a set of query strings and returns an object with the corresponding CatFactAPIArgs values.
 * @param {NextAPIQueryStrings} query - The set of query strings to parse.
 * @returns {CatFactAPIArgs} - An object with the corresponding CatFactAPIArgs values.
 */
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

/**
 * Adds an ID property to an array of Fact objects, based on the current page and limit.
 * @param {Fact[]} facts - An array of Fact objects to add an ID property to.
 * @param {number} currentPage - The current page being displayed. Defaults to 1.
 * @param {number} limit - The number of facts to display per page. Defaults to the value in the config file.
 * @returns {Fact[]} - An array of Fact objects with an ID property added to each object.
 */
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

/**
 * Sorts an array of Fact objects alphabetically.
 * @param {Fact[]} facts - An array of Fact objects to sort.
 * @param {boolean} sortAsc - Determines if the sorting is ascending or descending. Defaults to true (ascending).
 * @returns {Fact[]} - A sorted array of Fact objects.
 */
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

/**
 * Sorts an array of Fact objects by length.
 * @param {Fact[]} facts - An array of Fact objects to sort.
 * @param {boolean} sortAsc - Determines if the sorting is ascending or descending. Defaults to true (ascending).
 * @returns {Fact[]} - A sorted array of Fact objects.
 */
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

/**
 * Returns a positive number or a fallback value if the number is not positive.
 * @param {number|undefined} num - The number to check if it's positive.
 * @param {number} fallback - The fallback value to use if the number is not positive.
 * @returns {number} - A positive number or the fallback value.
 */
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
