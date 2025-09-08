"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Filter, Search, Building2, Users, Calendar, MapPin, X, Sun, Moon, Hash, Grid3X3, List, UsersRound, CircleDollarSign } from 'lucide-react';

// Add custom font classes
const fontClasses = `
  @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Cantarell:wght@400;700&display=swap');

  .font-work-sans {
    font-family: 'Work Sans', sans-serif;
  }

  .font-work-sans-bold {
    font-family: 'Work Sans', sans-serif;
    font-weight: 700;
  }

  .font-cantarell {
    font-family: 'Cantarell', sans-serif;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = fontClasses;
  document.head.appendChild(style);
}

type ExpandedSections = {
  sortBy: boolean;
  filterBy: boolean;
  industry: boolean;
  size: boolean;
  location: boolean;
  founded: boolean;
};

type SelectedFilters = {
  industry: string[];
  size: string[];
  location: string[];
  founded: string[];
};

export default function SideMenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    sortBy: true,
    filterBy: true,
    industry: false,
    size: false,
    location: false,
    founded: false
  });

  const [selectedSort, setSelectedSort] = useState<string>('name');
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    industry: [],
    size: [],
    location: [],
    founded: []
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<string>('grid');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // Ref for click outside detection
  const sideMenuRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category: keyof SelectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      industry: [],
      size: [],
      location: [],
      founded: []
    });
    setSearchQuery('');
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const toggleCardDetails = (cardIndex: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardIndex)) {
        newSet.delete(cardIndex);
      } else {
        newSet.add(cardIndex);
      }
      return newSet;
    });
  };

  const filterOptions = {
    industry: ['Software', 'Hardware', 'AI/ML', 'E-commerce', 'Fintech', 'Healthcare', 'Gaming', 'Social Media'],
    size: ['Startup (1-50)', 'Medium (51-500)', 'Large (501-5000)', 'Enterprise (5000+)'],
    location: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston', 'Los Angeles', 'Chicago', 'Remote'],
    founded: ['2020s', '2010s', '2000s', '1990s', 'Before 1990']
  };

  const sortOptions = [
    { value: 'name', label: 'Company Name' },
    { value: 'founded', label: 'Founded Date' },
    { value: 'size', label: 'Company Size' },
    { value: 'valuation', label: 'Valuation' },
    { value: 'funding', label: 'Total Funding' }
  ];

  interface SectionHeaderProps {
    title: string;
    icon: React.ComponentType<{ size: number }>;
    isExpanded: boolean;
    onClick: () => void;
  }

  const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon, isExpanded, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span>{title}</span>
      </div>
      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
  );

  interface FilterCheckboxProps {
    category: keyof SelectedFilters;
    value: string;
    checked: boolean;
    onChange: (category: keyof SelectedFilters, value: string) => void;
  }

  const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ category, value, checked, onChange }) => (
    <label className="flex items-center gap-2 py-1 px-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(category, value)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
      />
      <span>{value}</span>
    </label>
  );

  const activeFiltersCount = Object.values(selectedFilters).flat().length;

  // Close entire menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target as Node)
      ) {
        // Prevent accidental reopening by checking if it's a legitimate click outside
        const target = event.target as Node;
        const toggleButton = document.querySelector('[class*="fixed top-4 left-4"]') as Node;
        if (target !== toggleButton && !toggleButton?.contains(target)) {
          setIsMenuOpen(false);
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Toggle Button */}
      <button
        onClick={() => {
          if (isMenuOpen) {
            setIsMenuOpen(false);
          } else {
            setIsMenuOpen(true);
          }
        }}
        className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-indigo-500 to-rose-500 border border-indigo-500/30 rounded-lg hover:scale-115 hover:from-indigo-600 hover:to-rose-600 text-white transition-all duration-300 ease-in-out dark:from-indigo-600 dark:to-rose-600 dark:hover:from-indigo-700 dark:hover:to-rose-700"
      >
        <Filter size={18} className="text-white" strokeWidth={2} />
      </button>

      {/* Side Menu */}
      <div
        ref={sideMenuRef}
        className={`fixed top-0 left-0 h-full z-40 ${isMenuOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden bg-white border-r border-gray-200 shadow-lg dark:bg-black dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pl-12">Filters & Sort</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors dark:hover:bg-gray-700"
              >
                <X size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Sort By Section */}
            <div className="space-y-2">
              <SectionHeader
                title="Sort By"
                icon={Building2}
                isExpanded={expandedSections.sortBy}
                onClick={() => toggleSection('sortBy')}
              />

              {expandedSections.sortBy && (
                <div className="space-y-1 ml-4">
                  {sortOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 py-1 px-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={selectedSort === option.value}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter By Section */}
            <div className="space-y-2">
              <SectionHeader
                title={`Filter By ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`}
                icon={Filter}
                isExpanded={expandedSections.filterBy}
                onClick={() => toggleSection('filterBy')}
              />

              {expandedSections.filterBy && (
                <div className="space-y-3 ml-4">
                  {/* Industry Filter */}
                  <div>
                    <SectionHeader
                      title="Industry"
                      icon={Building2}
                      isExpanded={expandedSections.industry}
                      onClick={() => toggleSection('industry')}
                    />
                    {expandedSections.industry && (
                      <div className="space-y-1 ml-4 max-h-40 overflow-y-auto">
                        {filterOptions.industry.map(option => (
                          <FilterCheckbox
                            key={option}
                            category="industry"
                            value={option}
                            checked={selectedFilters.industry.includes(option)}
                            onChange={handleFilterChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Company Size Filter */}
                  <div>
                    <SectionHeader
                      title="Company Size"
                      icon={Users}
                      isExpanded={expandedSections.size}
                      onClick={() => toggleSection('size')}
                    />
                    {expandedSections.size && (
                      <div className="space-y-1 ml-4">
                        {filterOptions.size.map(option => (
                          <FilterCheckbox
                            key={option}
                            category="size"
                            value={option}
                            checked={selectedFilters.size.includes(option)}
                            onChange={handleFilterChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Filter */}
                  <div>
                    <SectionHeader
                      title="Location"
                      icon={MapPin}
                      isExpanded={expandedSections.location}
                      onClick={() => toggleSection('location')}
                    />
                    {expandedSections.location && (
                      <div className="space-y-1 ml-4 max-h-40 overflow-y-auto">
                        {filterOptions.location.map(option => (
                          <FilterCheckbox
                            key={option}
                            category="location"
                            value={option}
                            checked={selectedFilters.location.includes(option)}
                            onChange={handleFilterChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Founded Filter */}
                  <div>
                    <SectionHeader
                      title="Founded"
                      icon={Calendar}
                      isExpanded={expandedSections.founded}
                      onClick={() => toggleSection('founded')}
                    />
                    {expandedSections.founded && (
                      <div className="space-y-1 ml-4">
                        {filterOptions.founded.map(option => (
                          <FilterCheckbox
                            key={option}
                            category="founded"
                            value={option}
                            checked={selectedFilters.founded.includes(option)}
                            onChange={handleFilterChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {activeFiltersCount > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto pt-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black dark:text-white font-work-sans-bold">
              Blueprint Directory
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 bg-white hover:bg-gray-50 hover:scale-105 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out text-gray-700 hover:text-gray-900 shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
              >
                {viewMode === 'grid' ? <List size={18} strokeWidth={2} /> : <Grid3X3 size={18} strokeWidth={2} />}
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-white hover:bg-gray-50 hover:scale-105 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out text-gray-700 hover:text-gray-900 shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {/* Active Filters & Search Display */}
          {(activeFiltersCount > 0 || searchQuery) && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800/50 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Filter size={16} className="text-gray-600 dark:text-gray-300" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    Active Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                  {searchQuery && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-md dark:bg-blue-900/50 dark:text-blue-200">
                      <Search size={14} />
                      <span>"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {Object.entries(selectedFilters).map(([category, values]) =>
                    values.map((value, index) => (
                      <div key={`${category}-${value}`} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md flex-shrink-0 ${
                        index % 2 === 0
                          ? 'bg-gradient-to-r from-indigo-100 to-rose-100 text-gray-700 dark:from-indigo-900/30 dark:to-rose-900/30 dark:text-gray-300'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        <Hash size={14} />
                        <span className="capitalize">{category}: {value}</span>
                        <button
                          onClick={() => handleFilterChange(category as keyof SelectedFilters, value)}
                          className={`ml-1 rounded-full p-0.5 ${index % 2 === 0
                            ? 'hover:bg-indigo-200 dark:hover:bg-indigo-800/50'
                            : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {(activeFiltersCount > 0 || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex-shrink-0"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {activeFiltersCount > 0 && searchQuery && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Filtering companies by {activeFiltersCount} criteria and search term
                </p>
              )}
            </div>
          )}

          {/* Sample Content */}
          <div className={viewMode === 'grid' ? 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
            {[
              { name: 'TechCorp Inc.', industry: 'Software', size: 'Large (501-5000)', location: 'San Francisco', founded: '2010', employees: '2,500', funding: '$150M', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&crop=center' },
              { name: 'AI Innovations', industry: 'AI/ML', size: 'Medium (51-500)', location: 'Boston', founded: '2018', employees: '250', funding: '$45M', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center' },
              { name: 'GameStudio Pro', industry: 'Gaming', size: 'Startup (1-50)', location: 'Austin', founded: '2021', employees: '35', funding: '$8M', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop&crop=center' },
              { name: 'FinanceFlow', industry: 'Fintech', size: 'Medium (51-500)', location: 'New York', founded: '2016', employees: '450', funding: '$85M', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&crop=center' },
              { name: 'HealthTech Solutions', industry: 'Healthcare', size: 'Large (501-5000)', location: 'Seattle', founded: '2012', employees: '1,800', funding: '$200M', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&crop=center' },
              { name: 'CloudSync Systems', industry: 'Software', size: 'Medium (51-500)', location: 'Remote', founded: '2019', employees: '180', funding: '$32M', image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=800&h=400&fit=crop&crop=center' },
              { name: 'RoboTech Dynamics', industry: 'Hardware', size: 'Large (501-5000)', location: 'Los Angeles', founded: '2008', employees: '3,200', funding: '$320M', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center' },
              { name: 'SocialConnect', industry: 'Social Media', size: 'Enterprise (5000+)', location: 'San Francisco', founded: '2005', employees: '12,000', funding: '$1.2B', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center' }
            ].map((company, index) => (
              viewMode === 'grid' ? (
                // Grid Card View
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-xl hover:shadow-purple-500/30 hover:shadow-rose-500/30 hover:shadow-magenta-500/30 hover:border-purple-500/50 hover:border-rose-500/50 hover:border-magenta-500/50 hover:scale-105 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-2xl dark:hover:shadow-purple-500/25 dark:hover:shadow-rose-500/25 dark:hover:shadow-magenta-500/25 dark:hover:border-purple-500/70 dark:hover:border-rose-500/70 dark:hover:border-magenta-500/70">
                  <div className="w-full h-40 mb-4 rounded-lg overflow-hidden relative">
                    <img
                      src={company.image}
                      alt={`${company.name} company image`}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />

                    {/* Bottom Left - Employees Overlay */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      <UsersRound size={12} />
                      <span>{company.employees}</span>
                    </div>

                    {/* Bottom Right - Funding Overlay */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      <CircleDollarSign size={12} />
                      <span>{company.funding}</span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg dark:text-gray-100 font-work-sans">{company.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900/50 dark:text-blue-200 font-cantarell">
                      {company.industry}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleCardDetails(index)}
                    className="flex items-center gap-2 w-full p-2 text-left text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ease-out font-cantarell"
                  >
                    <span className="flex-1 font-medium">
                      {expandedCards.has(index) ? 'Hide Details' : 'View Details'}
                    </span>
                    <div className={`transition-transform duration-300 ease-out ${
                      expandedCards.has(index) ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
                    }`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  <div className={`overflow-hidden transition-all duration-500 ease-out ${
                    expandedCards.has(index)
                      ? 'max-h-40 opacity-100 transform scale-100 translate-y-0 mb-4'
                      : 'max-h-0 opacity-0 transform scale-95 translate-y-2'
                  }`}>
                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700/50 animate-in slide-in-from-top duration-300 delay-100">
                      <div className="flex items-center gap-2 transition-all duration-300 ease-out delay-100 font-cantarell">
                        <Users size={14} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{company.size}</span>
                      </div>
                      <div className="flex items-center gap-2 transition-all duration-300 ease-out delay-150 font-cantarell">
                        <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{company.location}</span>
                      </div>
                      <div className="flex items-center gap-2 transition-all duration-300 ease-out delay-200 font-cantarell">
                        <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Founded {company.founded}</span>
                      </div>
                    </div>
                  </div>


                </div>
              ) : (
                // List Row View
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-xl hover:shadow-purple-500/30 hover:shadow-rose-500/30 hover:shadow-magenta-500/30 hover:border-purple-500/50 hover:border-rose-500/50 hover:border-magenta-500/50 hover:scale-105 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-2xl dark:hover:shadow-purple-500/25 dark:hover:shadow-rose-500/25 dark:hover:shadow-magenta-500/25 dark:hover:border-purple-500/70 dark:hover:border-rose-500/70 dark:hover:border-magenta-500/70">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={company.image}
                        alt={`${company.name} company image`}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg dark:text-gray-100 font-work-sans">{company.name}</h3>
                        </div>
                        <span className="hidden md:inline text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900/50 dark:text-blue-200">
                          {company.industry}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry}</p>
                        <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-400 dark:text-gray-500" />
                            <span>{company.employees}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
                            <span>{company.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-ray-400 dark:text-gray-500" />
                            <span>Est. {company.founded}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{company.funding}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Funding</p>
                    </div>
                  </div>
                  {/* Mobile-only additional info */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{company.employees} employees</span>
                      <span>{company.location}</span>
                      <span>Est. {company.founded}</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
