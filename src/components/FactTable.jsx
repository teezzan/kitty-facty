import { useState, useEffect } from "react";

export default function FactTable() {
  const [facts, setFacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [perPage, setPerPage] = useState(10);

  const fetchFacts = (page = 1, limit = 10) => {
    fetch(`/api/facts?page=${page}&perPage=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setFacts(data.facts);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      });
  };

  useEffect(() => {
    fetchFacts();
  }, []);

  const handlePageChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    if (newPerPage < 1) {
      return;
    }
    setPerPage(newPerPage);
    fetchFacts(1, newPerPage);
  };

  const handleFetchClick = () => {
    const page = parseInt(pageInput);
    if (isNaN(page) || page < 1 || page > totalPages) {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
      return;
    }
    fetchFacts(page, perPage);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="my-4">
        <label className="block text-gray-700 font-bold mb-2">
          Per Page
          <input
            className="shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            min="1"
            value={perPage}
            onChange={handlePerPageChange}
          />
        </label>
      </div>
      <div className="my-4">
        <label className="block text-gray-700 font-bold mb-2">
          Page
          <select
            className="shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={pageInput}
            onChange={handlePageChange}
            disabled={totalPages === 0}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </label>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleFetchClick}
        >
          Fetch
        </button>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Fact</th>
          </tr>
        </thead>
        <tbody>
          {facts.map((fact) => (
            <tr key={fact.id}>
              <td className="border px-4 py-2">{fact.id}</td>
              <td className="border px-4 py-2">{fact.fact}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="my-4">
        {currentPage} of {totalPages}
      </div>
    </div>
  );
}
