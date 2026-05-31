import React from 'react';

const ResponsiveTable = ({
  columns,
  data,
  renderActions,
  emptyMessage = 'No data available',
}) => {
  // Helper to get cell value, can be string or React element
  const getCellValue = (row, column) => {
    if (column.render) {
      return column.render(row);
    }
    return row[column.key];
  };

  return (
    <div className="w-full">
      {/* Desktop: Table view */}
      <div className="hidden md:block w-full overflow-x-auto border border-border rounded-2xl">
        <div className="min-w-max w-full">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60"
                  >
                    {column.title}
                  </th>
                ))}
                {renderActions && (
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (renderActions ? 1 : 0)}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-4 text-sm text-foreground"
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-4 py-4">
                        {renderActions(row, rowIndex)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet: Card view */}
      <div className="md:hidden space-y-4 w-full">
        {data.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 space-y-4"
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    {column.title}
                  </span>
                  <div className="text-sm text-foreground">
                    {getCellValue(row, column)}
                  </div>
                </div>
              ))}
              {renderActions && (
                <div className="pt-4 border-t border-border">
                  {renderActions(row, index)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponsiveTable;
