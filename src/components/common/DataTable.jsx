import React, { useState, useMemo } from 'react';
import { Search, Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import { exportToCsv } from '../../utils/exportCsv';

export default function DataTable({
  columns = [],
  data = [],
  searchKey = '',
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  filterKey = '',
  pageSize = 8,
  exportFileName = 'export-data',
  actions = null,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search criteria or filters.',
  className = ''
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Filter matching
      if (filterKey && selectedFilter !== 'All') {
        const rowVal = String(row[filterKey] || '').toLowerCase();
        if (rowVal !== selectedFilter.toLowerCase()) return false;
      }

      // Search matching
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      if (searchKey) {
        return String(row[searchKey] || '').toLowerCase().includes(q);
      }

      // Fallback: search all primitive values in row
      return Object.values(row).some((val) =>
        String(val || '').toLowerCase().includes(q)
      );
    });
  }, [data, searchQuery, selectedFilter, searchKey, filterKey]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    exportToCsv(exportFileName, sortedData);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Control Bar: Search + Filter + Export + Custom Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)]">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:border-[#075EE8] focus:outline-hidden bg-slate-50/50"
            />
          </div>

          {/* Filter Dropdown */}
          {filterOptions && filterOptions.length > 0 && (
            <select
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:border-[#075EE8]"
            >
              <option value="All">All {filterKey ? filterKey.charAt(0).toUpperCase() + filterKey.slice(1) : ''}</option>
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {actions}

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(7,29,73,0.03)] overflow-hidden">
        {paginatedData.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              onAction={() => {
                setSearchQuery('');
                setSelectedFilter('All');
              }}
              actionText="Clear Filters"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  {columns.map((col) => (
                    <th
                      key={col.key || col.header}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-4 py-3.5 ${col.sortable ? 'cursor-pointer select-none hover:text-[#075EE8]' : ''} ${col.className || ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {sortKey === col.key ? (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-[#075EE8]" /> : <ChevronDown className="w-3 h-3 text-[#075EE8]" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedData.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-blue-50/30 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key || col.header} className={`px-4 py-3.5 ${col.className || ''}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {sortedData.length > pageSize && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

