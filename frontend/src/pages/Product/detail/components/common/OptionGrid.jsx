import React from 'react';

// The grid will show a maximum of ~2 rows before scrolling.
// Row height is ~2.25rem (h-9) for colors/sizes, gap is 0.75rem (gap-3)
// Container height for 2 rows: (2 * 2.25rem) + (1 * 0.75rem) = 5.25rem
// We'll use max-h-24 (6rem) to provide some buffer and define the scrollable area.
const SCROLLABLE_CONTAINER_HEIGHT = '6rem';

const OptionGrid = ({ options, renderOption, type }) => {
    // Calculate max-width for 5 items per row to maintain the grid structure.
    // Colors: 5 * 2.25rem (w-9) + 4 * 0.75rem (gap-3) = 14.25rem -> use max-w-[14.5rem]
    // Sizes: Variable, so use a more general constraint like max-w-md
    const containerMaxWidth = type === 'color' ? 'max-w-[14.5rem]' : 'max-w-md';

    return (
        <div 
            className={`flex p-2 flex-wrap gap-3 overflow-y-auto ${containerMaxWidth}`}
            style={{ maxHeight: SCROLLABLE_CONTAINER_HEIGHT }}
        >
            {options.map(option => renderOption(option))}
        </div>
    );
};

export default OptionGrid;