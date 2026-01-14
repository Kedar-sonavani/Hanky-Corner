'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Checkbox } from './ui/checkbox';

interface FilterSection {
    title: string;
    key: string;
    options: { label: string; count?: number; id: string }[];
}

interface SidebarFiltersProps {
    priceRange: [number, number];
    onPriceChange: (value: [number, number]) => void;
    categories: { id: string, name: string }[];
    selectedCategories: string[];
    onCategoryChange: (id: string) => void;
}

// These are hardcoded as per user's request, but we logic-link them
const STATIC_SECTIONS: FilterSection[] = [
    {
        title: "Availability",
        key: "availability",
        options: [
            { id: "in-stock", label: "In stock", count: 23 },
            { id: "out-of-stock", label: "Out of stock", count: 0 }
        ]
    }
];

export function PriceFilter({
    priceRange,
    onPriceChange,
    categories,
    selectedCategories,
    onCategoryChange
}: SidebarFiltersProps) {
    return (
        <div className="space-y-8">
            {/* --- Categories Section --- */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider">Collections</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={cat.id}
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => onCategoryChange(cat.id)}
                            />
                            <label
                                htmlFor={cat.id}
                                className="text-sm cursor-pointer"
                            >
                                {cat.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Price Slider Section --- */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm uppercase tracking-wider">Price</h3>
                <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={priceRange}
                    max={10000}
                    step={10}
                    onValueChange={(val) => onPriceChange(val as [number, number])}
                >
                    <Slider.Track className="bg-zinc-200 relative grow h-[3px] rounded-full">
                        <Slider.Range className="absolute bg-primary h-full rounded-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:bg-zinc-50 focus:outline-none cursor-pointer" />
                    <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:bg-zinc-50 focus:outline-none cursor-pointer" />
                </Slider.Root>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <input
                            type="number"
                            value={priceRange[0]}
                            readOnly
                            className="w-full pl-6 pr-2 py-1 border rounded text-xs bg-zinc-50"
                        />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            readOnly
                            className="w-full pl-6 pr-2 py-1 border rounded text-xs bg-zinc-50"
                        />
                    </div>
                </div>
            </div>

            {/* --- Static Dynamic Category Sections (Keeping user design) --- */}
            {STATIC_SECTIONS.map((section) => (
                <div key={section.key} className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold text-sm uppercase tracking-wider">{section.title}</h3>
                    <div className="space-y-2">
                        {section.options.map((option) => (
                            <div key={option.id} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id={option.id} />
                                    <label
                                        htmlFor={option.id}
                                        className="text-sm leading-none cursor-pointer"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                                {option.count !== undefined && (
                                    <span className="text-xs text-muted-foreground">({option.count})</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}