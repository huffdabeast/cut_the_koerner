import { useState } from 'react';
import { ChevronDown, ChevronRight, Filter, Search, Building2, Users, Calendar, MapPin, X } from 'lucide-react';

export default function SideMenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    sortBy: true,
    filterBy: true,
    industry: false,
    size: false,
    location: false,
    founded: false
  });
  
  const [selectedSort, setSelectedSort] = useState('name');
  const [selectedFilters, setSelectedFilters] = useState({
    industry: [],
    size: [],
    location: [],
    founded: []
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
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

  const SectionHeader = ({ title, icon: Icon, isExpanded, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span>{title}</span>
      </div>
      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
  );

  const FilterCheckbox = ({ category, value, checked, onChange }) => (
    <label className="flex items-center gap-2 py-1 px-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer rounded-md transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(category, value)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
      />
      <span>{value}</span>
    </label>
  );

  const activeFiltersCount = Object.values(selectedFilters).flat().length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <Filter size={16} className="text-gray-600" />
      </button>

      {/* Side Menu */}
      <div className={`${isMenuOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden bg-white border-r border-gray-200 shadow-sm`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters & Sort</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={16} className="text-gray-500" />
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
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
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
                    <label key={option.value} className="flex items-center gap-2 py-1 px-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer rounded-md transition-colors">
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={selectedSort === option.value}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
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
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Tech Companies Directory</h1>
          
          {/* Applied Filters Display */}
          {(activeFiltersCount > 0 || searchQuery) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Legacy Filter Display (will be removed):</h3>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {Object.entries(selectedFilters).map(([category, values]) =>
                  values.map(value => (
                    <span key={`${category}-${value}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {category}: {value}
                      <button onClick={() => handleFilterChange(category, value)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Sample Content */}
          <div className={viewMode === 'grid' ? 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
            {[
              { name: 'TechCorp Inc.', industry: 'Software', size: 'Large (501-5000)', location: 'San Francisco', founded: '2010', employees: '2,500', funding: '$150M' },
              { name: 'AI Innovations', industry: 'AI/ML', size: 'Medium (51-500)', location: 'Boston', founded: '2018', employees: '250', funding: '$45M' },
              { name: 'GameStudio Pro', industry: 'Gaming', size: 'Startup (1-50)', location: 'Austin', founded: '2021', employees: '35', funding: '$8M' },
              { name: 'FinanceFlow', industry: 'Fintech', size: 'Medium (51-500)', location: 'New York', founded: '2016', employees: '450', funding: '$85M' },
              { name: 'HealthTech Solutions', industry: 'Healthcare', size: 'Large (501-5000)', location: 'Seattle', founded: '2012', employees: '1,800', funding: '$200M' },
              { name: 'CloudSync Systems', industry: 'Software', size: 'Medium (51-500)', location: 'Remote', founded: '2019', employees: '180', funding: '$32M' },
              { name: 'RoboTech Dynamics', industry: 'Hardware', size: 'Large (501-5000)', location: 'Los Angeles', founded: '2008', employees: '3,200', funding: '$320M' },
              { name: 'SocialConnect', industry: 'Social Media', size: 'Enterprise (5000+)', location: 'San Francisco', founded: '2005', employees: '12,000', funding: '$1.2B' }
            ].map((company, index) => (
              viewMode === 'grid' ? (
                // Grid Card View
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{company.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {company.industry}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{company.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Founded {company.founded}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Employees:</span>
                        <span className="font-medium text-gray-700">{company.employees}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Funding:</span>
                        <span className="font-medium text-gray-700">{company.funding}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // List Row View
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <h3 className="font-semibold text-gray-900 text-lg">{company.name}</h3>
                          <p className="text-sm text-gray-500">{company.industry}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-400" />
                            <span>{company.employees}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{company.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            <span>Est. {company.founded}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-900">{company.funding}</p>
                      <p className="text-xs text-gray-500">Total Funding</p>
                    </div>
                  </div>
                  {/* Mobile-only additional info */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
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