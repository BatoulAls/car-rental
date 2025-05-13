import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers array
  const getPageNumbersToDisplay = () => {
    // If we have 7 or fewer pages, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always include first and last page
    // For middle pages, show current +/- 1 and ellipsis
    const pageNumbers = [];
    
    // Always add page 1
    pageNumbers.push(1);
    
    // Handle different scenarios
    if (currentPage <= 3) {
      // Near start: show 1, 2, 3, 4, 5, ..., totalPages
      pageNumbers.push(2, 3, 4, 5, 'ellipsis', totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near end: show 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
      pageNumbers.push('ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Middle: show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      pageNumbers.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbersToDisplay();

  return (
    <nav className="pagination">
      <button
        className="pagination__button pagination__button--prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous</span>
      </button>
      
      <div className="pagination__pages">
        {pageNumbers.map((page, index) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="pagination__ellipsis">...</span>
          ) : (
            <button
              key={page}
              className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      <button
        className="pagination__button pagination__button--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span>Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;