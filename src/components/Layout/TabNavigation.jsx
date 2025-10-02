import React, { useState } from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      {/* Desktop Navigation */}
      <nav className="hidden sm:flex -mb-px space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      {/* Mobile Dropdown Navigation */}
      <div className="sm:hidden">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between text-sm font-medium text-gray-700"
          >
            <div className="flex items-center">
              <span className="mr-2">{activeTabData?.icon}</span>
              {activeTabData?.name}
            </div>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setShowDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center hover:bg-gray-50 transition-colors ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;