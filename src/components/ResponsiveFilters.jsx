import React from 'react';

const ResponsiveFilters = ({ children }) => {
  return (
    <div className="w-full flex flex-wrap items-center gap-3">
      {children}
    </div>
  );
};

export default ResponsiveFilters;
