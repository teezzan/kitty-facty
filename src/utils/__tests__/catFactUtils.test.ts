import { Fact } from "@/interfaces/api";
import {
  addIDToCatFacts,
  sortFactsAlphabetically,
  sortFactsByLength,
} from "../catFactUtils";

describe("addIDToCatFacts", () => {
  it("should add id to each fact in the array", () => {
    const inputFacts = [
      { fact: "Cats are awesome!", length: 16 },
      { fact: "Cats are cute!", length: 14 },
      { fact: "Cats are curious creatures!", length: 17 },
    ];

    const expectedFacts = [
      { fact: "Cats are awesome!", id: 1, length: 16 },
      { fact: "Cats are cute!", id: 2, length: 14 },
      { fact: "Cats are curious creatures!", id: 3, length: 17 },
    ];

    const result = addIDToCatFacts(inputFacts as Fact[]);

    expect(result).toEqual(expectedFacts);
  });

  it("should return an empty array if input is empty", () => {
    const inputFacts: Fact[] = [];
    const expectedFacts: Fact[] = [];

    const result = addIDToCatFacts(inputFacts);

    expect(result).toEqual(expectedFacts);
  });

  it("should calculate id correctly based on current page and limit", () => {
    const inputFacts = [
      { fact: "Cats are awesome!", length: 16 },
      { fact: "Cats are cute!", length: 14 },
      { fact: "Cats are curious creatures!", length: 17 },
      { fact: "Cats have nine lives!", length: 21 },
      { fact: "Cats can see in the dark!", length: 26 },
    ];

    const expectedFacts = [
      { fact: "Cats are awesome!", id: 1, length: 16 },
      { fact: "Cats are cute!", id: 2, length: 14 },
      { fact: "Cats are curious creatures!", id: 3, length: 17 },
      { fact: "Cats have nine lives!", id: 4, length: 21 },
      { fact: "Cats can see in the dark!", id: 5, length: 26 },
    ];

    const result = addIDToCatFacts(inputFacts as Fact[], 1, 5);

    expect(result).toEqual(expectedFacts);
  });

  it("should calculate id correctly when current page is greater than 1", () => {
    const inputFacts = [
      { fact: "Cats have nine lives!", length: 21 },
      { fact: "Cats can see in the dark!", length: 26 },
      { fact: "Cats are awesome!", length: 16 },
      { fact: "Cats are cute!", length: 14 },
      { fact: "Cats are curious creatures!", length: 17 },
    ];

    const expectedFacts = [
      { fact: "Cats have nine lives!", id: 6, length: 21 },
      { fact: "Cats can see in the dark!", id: 7, length: 26 },
      { fact: "Cats are awesome!", id: 8, length: 16 },
      { fact: "Cats are cute!", id: 9, length: 14 },
      { fact: "Cats are curious creatures!", id: 10, length: 17 },
    ];

    const result = addIDToCatFacts(inputFacts as Fact[], 2, 5);

    expect(result).toEqual(expectedFacts);
  });
});

describe("sortFactsAlphabetically", () => {
  const unsortedFacts: Fact[] = [
    { fact: "Cats are cute", length: 14 },
    { fact: "Dogs are friendly", length: 18 },
    { fact: "Birds can fly", length: 14 },
  ];

  it("should sort facts alphabetically in ascending order", () => {
    const sortedFacts = sortFactsAlphabetically(unsortedFacts, true);

    expect(sortedFacts).toEqual([
      { fact: "Birds can fly", length: 14 },
      { fact: "Cats are cute", length: 14 },
      { fact: "Dogs are friendly", length: 18 },
    ]);
  });

  it("should sort facts alphabetically in descending order", () => {
    const sortedFacts = sortFactsAlphabetically(unsortedFacts, false);

    expect(sortedFacts).toEqual([
      { fact: "Dogs are friendly", length: 18 },
      { fact: "Cats are cute", length: 14 },
      { fact: "Birds can fly", length: 14 },
    ]);
  });

  it("should return original array if only one element is present", () => {
    const singleFactArray = [{ fact: "Cats are cute", length: 14 }];
    const sortedFacts = sortFactsAlphabetically(singleFactArray, true);

    expect(sortedFacts).toEqual(singleFactArray);
  });

  it("should return empty array if empty array is passed", () => {
    const emptyArray: Fact[] = [];
    const sortedFacts = sortFactsAlphabetically(emptyArray, true);

    expect(sortedFacts).toEqual([]);
  });
});

describe("sortFactsByLength", () => {
  const facts = [
    { fact: "Fact 1", length: 6 },
    { fact: "Fact 2", length: 5 },
    { fact: "Fact 3", length: 4 },
    { fact: "Fact 4", length: 3 },
    { fact: "Fact 5", length: 2 },
    { fact: "Fact 6", length: 1 },
  ];

  it("should sort facts by length in ascending order by default", () => {
    const sortedFacts = sortFactsByLength(facts);
    expect(sortedFacts).toEqual([
      { fact: "Fact 6", length: 1 },
      { fact: "Fact 5", length: 2 },
      { fact: "Fact 4", length: 3 },
      { fact: "Fact 3", length: 4 },
      { fact: "Fact 2", length: 5 },
      { fact: "Fact 1", length: 6 },
    ]);
  });

  it("should sort facts by length in descending order when sortAsc is false", () => {
    const sortedFacts = sortFactsByLength(facts, false);
    expect(sortedFacts).toEqual([
      { fact: "Fact 1", length: 6 },
      { fact: "Fact 2", length: 5 },
      { fact: "Fact 3", length: 4 },
      { fact: "Fact 4", length: 3 },
      { fact: "Fact 5", length: 2 },
      { fact: "Fact 6", length: 1 },
    ]);
  });

  it("should return an empty array when given an empty array", () => {
    const sortedFacts = sortFactsByLength([]);
    expect(sortedFacts).toEqual([]);
  });
});
