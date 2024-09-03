import ReactPaginate from "react-paginate";

export default function Pagination({ pageCount, onPageChange }) {
  return (
    <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={"Next"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={"flex justify-center space-x-2 mt-4"}
      pageClassName={"px-3 py-1 bg-gray-200 rounded-lg cursor-pointer"}
      activeClassName={"bg-blue-500 text-white"}
    />
  );
}
