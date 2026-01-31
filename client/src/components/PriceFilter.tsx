'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Checkbox } from './ui/checkbox';

interface SidebarFiltersProps {
    // Price
    priceRange: [number, number];
    onPriceChange: (value: [number, number]) => void;

    // Categories
    categories: { id: string, name: string }[];
    selectedCategories: string[];
    onCategoryChange: (id: string) => void;

    // Availability (NEW)
    selectedAvailability: string[];
    onAvailabilityChange: (id: string) => void;
    availabilityCounts: { inStock: number; outOfStock: number };
}

export function PriceFilter({
    priceRange,
    onPriceChange,
    categories,
    selectedCategories,
    onCategoryChange,
    selectedAvailability,
    onAvailabilityChange,
    availabilityCounts
}: SidebarFiltersProps) {

    const availabilityOptions = [
        { id: 'in-stock', label: 'In Stock', count: availabilityCounts.inStock },
        { id: 'out-of-stock', label: 'Out of Stock', count: availabilityCounts.outOfStock }
    ];

    return (
        <div className="space-y-8">
            {/* --- Categories Section --- */}
            <div className="space-y-4">
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground">Collections</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox
                                id={cat.id}
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => onCategoryChange(cat.id)}
                                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label
                                htmlFor={cat.id}
                                className="text-sm font-sans text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer select-none"
                            >
                                {cat.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Price Slider Section --- */}
            <div className="space-y-6 pt-6 border-t border-border">
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground">Price</h3>
                <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={priceRange}
                    max={10000}
                    step={10}
                    onValueChange={(val) => onPriceChange(val as [number, number])}
                >
                    <Slider.Track className="bg-secondary relative grow h-[3px] rounded-full">
                        <Slider.Range className="absolute bg-primary h-full rounded-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-5 h-5 bg-background border-2 border-primary shadow-lg rounded-full hover:scale-110 transition-transform focus:outline-none cursor-pointer" />
                    <Slider.Thumb className="block w-5 h-5 bg-background border-2 border-primary shadow-lg rounded-full hover:scale-110 transition-transform focus:outline-none cursor-pointer" />
                </Slider.Root>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-sans text-xs">₹</span>
                        <input
                            type="number"
                            value={priceRange[0]}
                            readOnly
                            className="w-full pl-7 pr-3 py-2 border border-border rounded-lg text-sm bg-background/50 font-sans"
                        />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-sans text-xs">₹</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            readOnly
                            className="w-full pl-7 pr-3 py-2 border border-border rounded-lg text-sm bg-background/50 font-sans"
                        />
                    </div>
                </div>
            </div>

            {/* --- Availability Section (Dynamic) --- */}
            <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground">Availability</h3>
                <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                        <div key={option.id} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id={option.id}
                                    checked={selectedAvailability.includes(option.id)}
                                    onChange={() => onAvailabilityChange(option.id)}
                                    className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <label
                                    htmlFor={option.id}
                                    className="text-sm font-sans text-muted-foreground group-hover:text-foreground transition-colors leading-none cursor-pointer select-none"
                                >
                                    {option.label}
                                </label>
                            </div>
                            <span className="text-xs text-muted-foreground/50 font-bold">({option.count})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}