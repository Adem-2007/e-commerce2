// src/pages/Product/ProductDetailPage/components/common/OptionGrid.jsx

import React from 'react';

// The grid will show a maximum of ~2 rows before scrolling.
// Row height is ~2.25rem (h-9) for colors/sizes, gap is 0.75rem (gap-3)
// Container height for 2 rows: (2 * 2.25rem) + (1 * 0.75rem) = 5.25rem
// We'll use max-h-24 (6rem) to provide some buffer and define the scrollable area.
const SCROLLABLE_CONTAINER_HEIGHT = '6rem';

const OptionGrid = ({ options, renderOption, type }) => {

    return (
        <div 
            className="flex flex-wrap gap-3 overflow-y-auto"
            style={{ maxHeight: SCROLLABLE_CONTAINER_HEIGHT }}
        >
            {options.map(option => renderOption(option))}
        </div>
    );
};

export default OptionGrid;