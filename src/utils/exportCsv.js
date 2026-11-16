// CSV Export helper (accepts either (filename, rows) or (rows, filename))
export const exportToCsv = (arg1, arg2) => {
  let filename = 'export';
  let rows = [];

  if (typeof arg1 === 'string' && Array.isArray(arg2)) {
    filename = arg1;
    rows = arg2;
  } else if (Array.isArray(arg1) && typeof arg2 === 'string') {
    rows = arg1;
    filename = arg2;
  } else if (Array.isArray(arg1)) {
    rows = arg1;
    filename = typeof arg2 === 'string' ? arg2 : 'export';
  } else if (Array.isArray(arg2)) {
    rows = arg2;
    filename = typeof arg1 === 'string' ? arg1 : 'export';
  }

  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date
          ? cell.toLocaleString()
          : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', cleanFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

