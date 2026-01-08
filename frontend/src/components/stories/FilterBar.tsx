import React from 'react';
import { Filter } from 'lucide-react';
import { Category } from '../../types';

export interface FilterBarProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onClearCategories: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearCategories,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="w-4 h-4 inline mr-1" />
            Kategori {selectedCategories.length > 0 && `(${selectedCategories.length} seçili)`}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClearCategories}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategories.length === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryToggle(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategories.includes(category.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sırala
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="popular">En Popüler</option>
            <option value="likes">En Çok Beğenilen</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

