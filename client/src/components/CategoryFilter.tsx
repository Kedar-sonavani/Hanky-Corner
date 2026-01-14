'use client';

import { Checkbox } from './ui/checkbox';

interface Category {
    id: string;
    name: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategories: string[];
    onCategoryChange: (id: string) => void;
}

export function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
    if (categories.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Collections</h3>
            <div className="space-y-2">
                {categories.map((cat) => (
                    <Checkbox
                        key={cat.id}
                        label={cat.name}
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => onCategoryChange(cat.id)}
                    />
                ))}
            </div>
        </div>
    );
}
