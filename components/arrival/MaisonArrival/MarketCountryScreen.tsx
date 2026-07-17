import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArrival } from "../hooks/useArrival";
import { ARRIVAL_CONFIG } from "../lib/arrival/config";
import { mapFadeUpVariants, mapStaggerContainer } from "../lib/arrival/animations";

export function MarketCountryScreen() {
  const { setStep, selectedRegion, setCountry, setLanguage } = useArrival();
  
  // The actively expanded country row (shows languages)
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
  
  // Search state (only visible if > 8 countries)
  const [searchQuery, setSearchQuery] = useState("");

  const countries = useMemo(() => {
    if (!selectedRegion) return [];
    return ARRIVAL_CONFIG.countries[selectedRegion] || [];
  }, [selectedRegion]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(c => c.label.toLowerCase().includes(query));
  }, [countries, searchQuery]);

  // Hide search completely unless necessary
  const showSearch = countries.length > 8;

  const handleLanguageSelect = (countryId: string, languageId: string) => {
    // Commit the selections
    setCountry(countryId);
    setLanguage(languageId);
    
    // Pause briefly for tactile feedback, then trigger Ceremony
    setTimeout(() => {
      setStep("SEQUENCE");
    }, 200);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div 
        variants={mapStaggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg flex flex-col items-center"
      >
        {/* Back Navigation */}
        <motion.div variants={mapFadeUpVariants} className="w-full mb-10 px-4 flex justify-start">
          <button
            onClick={() => setStep("REGION")}
            className="group flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            <span className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </span>
            <span>Back</span>
          </button>
        </motion.div>

        {/* Search (Conditionally Hidden) */}
        {showSearch && (
          <motion.div variants={mapFadeUpVariants} className="w-full px-4 mb-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={ARRIVAL_CONFIG.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-gray-800 py-4 text-white text-lg font-light focus:outline-none focus:border-white transition-colors duration-500 placeholder-gray-600"
                style={{ fontFamily: "var(--font-cormorant, serif)" }}
              />
            </div>
          </motion.div>
        )}

        {/* Unified Country & Language List */}
        <motion.ul variants={mapFadeUpVariants} className="w-full px-4 pb-24">
          {filteredCountries.map((country) => {
            const isExpanded = expandedCountryId === country.id;
            // When something is expanded, non-expanded items softly dim
            const isDimmed = expandedCountryId !== null && !isExpanded;
            
            const languages = ARRIVAL_CONFIG.languages[country.id] || ARRIVAL_CONFIG.languages.default;

            return (
              <li key={country.id} className="w-full border-b border-gray-900/30 overflow-hidden">
                <button
                  onClick={() => setExpandedCountryId(isExpanded ? null : country.id)}
                  className={`w-full flex items-center justify-between text-left py-6 transition-all duration-300 ${isDimmed ? "opacity-40 hover:opacity-70" : "opacity-100"}`}
                >
                  <span 
                    className={`text-xl md:text-2xl font-light transition-colors duration-300 ${isExpanded ? "text-white" : "text-gray-400"}`}
                    style={{ fontFamily: "var(--font-cormorant, serif)" }}
                  >
                    {country.label}
                  </span>
                  
                  {/* Expansion indicator */}
                  <span className={`text-gray-600 transition-transform duration-300 ${isExpanded ? "rotate-90" : "rotate-0"}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </button>

                {/* Progressive Disclosure: Language Selection */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full overflow-hidden"
                    >
                      <div className="pt-2 pb-8 pl-4 space-y-4">
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => handleLanguageSelect(country.id, lang.id)}
                            className="group flex flex-col items-start text-left w-full transition-opacity hover:opacity-70"
                          >
                            <span 
                              className="text-lg text-white font-light mb-1"
                              style={{ fontFamily: "var(--font-cormorant, serif)" }}
                            >
                              {lang.label}
                            </span>
                            <span 
                              className="text-[10px] text-gray-500 tracking-[0.2em] uppercase transition-colors group-hover:text-gray-400"
                              style={{ fontFamily: "var(--font-inter, sans-serif)" }}
                            >
                              {lang.localLabel}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </motion.ul>
      </motion.div>
    </div>
  );
}
