import React from 'react'

const CategoryTabs = ({ selected, onSelect, categories = ['All', 'Commercial', 'Residential'] }) => {
    return (
      <div className="text-center space-x-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`text-base md:text-lg lg:text-xl border-b-3 pb-1 ${selected === cat ? 'border-[#3C8576]' : 'border-transparent'} hover:border-[#3C8576]'`}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  };

  export default CategoryTabs