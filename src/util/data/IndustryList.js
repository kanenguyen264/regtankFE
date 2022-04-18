interface IndustryItem {
  key: string;
  value: string;
}

const IndustryList: IndustryItem[] = [
  {
    key: "ACCOUNTING",
    value: "Accounting"
  },
  {
    key: "AIRLINES_AVIATION",
    value: "Airlines/Aviation"
  },
  {
    key: "ALTERNATIVE_DISPUTE_RESOLUTION",
    value: "Alternative Dispute Resolution"
  },
  {
    key: "ALTERNATIVE_MEDICINE",
    value: "Alternative Medicine"
  },
  {
    key: "ANIMATION",
    value: "Animation"
  },
  {
    key: "APPAREL_FASHION",
    value: "Apparel/Fashion"
  },
  {
    key: "ARCHITECTURE_PLANNING",
    value: "Architecture/Planning"
  },
  {
    key: "ARTS_CRAFTS",
    value: "Arts/Crafts"
  },
  {
    key: "AUTOMOTIVE",
    value: "Automotive"
  },
  {
    key: "AVIATION_AEROSPACE",
    value: "Aviation/Aerospace"
  },
  {
    key: "BANKING_MORTGAGE",
    value: "Banking/Mortgage"
  },
  {
    key: "BIOTECHNOLOGY_GREENTECH",
    value: "Biotechnology/Greentech"
  },
  {
    key: "BROADCAST_MEDIA",
    value: "Broadcast Media"
  },
  {
    key: "BUILDING_MATERIALS",
    value: "Building Materials"
  },
  {
    key: "BUSINESS_SUPPLIES_EQUIPMENT",
    value: "Business Supplies/Equipment"
  },
  {
    key: "CAPITAL_MARKETS_HEDGE_FUND_PRIVATE_EQUITY",
    value: "Capital Markets/Hedge Fund/Private Equity"
  },
  {
    key: "CHEMICALS",
    value: "Chemicals"
  },
  {
    key: "CIVIC_SOCIAL_ORGANIZATION",
    value: "Civic/Social Organization"
  },
  {
    key: "CIVIL_ENGINEERING",
    value: "Civil Engineering"
  },
  {
    key: "COMMERCIAL_REAL_ESTATE",
    value: "Commercial Real Estate"
  },
  {
    key: "COMPUTER_GAMES",
    value: "Computer Games"
  },
  {
    key: "COMPUTER_HARDWARE",
    value: "Computer Hardware"
  },
  {
    key: "COMPUTER_NETWORKING",
    value: "Computer Networking"
  },
  {
    key: "COMPUTER_NETWORK_SECURITY",
    value: "Computer/Network Security"
  },
  {
    key: "COMPUTER_SOFTWARE_ENGINEERING",
    value: "Computer Software/Engineering"
  },
  {
    key: "CONSTRUCTION",
    value: "Construction"
  },
  {
    key: "CONSUMER_ELECTRONICS",
    value: "Consumer Electronics"
  },
  {
    key: "CONSUMER_GOODS",
    value: "Consumer Goods"
  },
  {
    key: "CONSUMER_SERVICES",
    value: "Consumer Services"
  },
  {
    key: "COSMETICS",
    value: "Cosmetics"
  },
  {
    key: "DAIRY",
    value: "Dairy"
  },
  {
    key: "DEFENSE_SPACE",
    value: "Defense/Space"
  },
  {
    key: "DESIGN",
    value: "Design"
  },
  {
    key: "EDUCATION_MANAGEMENT",
    value: "Education Management"
  },
  {
    key: "E-LEARNING",
    value: "E-Learning"
  },
  {
    key: "ELECTRICAL_ELECTRONIC_MANUFACTURING",
    value: "Electrical/Electronic Manufacturing"
  },
  {
    key: "ENTERTAINMENT_MOVIE_PRODUCTION",
    value: "Entertainment/Movie Production"
  },
  {
    key: "ENVIRONMENTAL_SERVICES",
    value: "Environmental Services"
  },
  {
    key: "EVENTS_SERVICES",
    value: "Events Services"
  },
  {
    key: "EXECUTIVE_OFFICE",
    value: "Executive Office"
  },
  {
    key: "FACILITIES_SERVICES",
    value: "Facilities Services"
  },
  {
    key: "FARMING",
    value: "Farming"
  },
  {
    key: "FINANCIAL_SERVICES",
    value: "Financial Services"
  },
  {
    key: "FINE_ART",
    value: "Fine Art"
  },
  {
    key: "FISHERY",
    value: "Fishery"
  },
  {
    key: "FOOD_BEVERAGES",
    value: "Food/Beverages"
  },
  {
    key: "FOOD_PRODUCTION",
    value: "Food Production"
  },
  {
    key: "FUNDRAISING",
    value: "Fundraising"
  },
  {
    key: "FURNITURE",
    value: "Furniture"
  },
  {
    key: "GAMBLING_CASINOS",
    value: "Gambling/Casinos"
  },
  {
    key: "GLASS_CERAMICS_CONCRETE",
    value: "Glass/Ceramics/Concrete"
  },
  {
    key: "GOVERNMENT_ADMINISTRATION",
    value: "Government Administration"
  },
  {
    key: "GOVERNMENT_RELATIONS",
    value: "Government Relations"
  },
  {
    key: "GRAPHIC_DESIGN_WEB_DESIGN",
    value: "Graphic Design/Web Design"
  },
  {
    key: "HEALTH_FITNESS",
    value: "Health/Fitness"
  },
  {
    key: "HIGHER_EDUCATION_ACADAMIA",
    value: "Higher Education/Acadamia"
  },
  {
    key: "HOSPITAL_HEALTH_CARE",
    value: "Hospital/Health Care"
  },
  {
    key: "HOSPITALITY",
    value: "Hospitality"
  },
  {
    key: "HUMAN_RESOURCES_HR",
    value: "Human Resources/HR"
  },
  {
    key: "IMPORT_EXPORT",
    value: "Import/Export"
  },
  {
    key: "INDIVCODEUAL_FAMILY_SERVICES",
    value: "Indivcodeual/Family Services"
  },
  {
    key: "INDUSTRIAL_AUTOMATION",
    value: "Industrial Automation"
  },
  {
    key: "INFORMATION_SERVICES",
    value: "Information Services"
  },
  {
    key: "INFORMATION_TECHNOLOGY_IT",
    value: "Information Technology/IT"
  },
  {
    key: "INSURANCE",
    value: "Insurance"
  },
  {
    key: "INTERNATIONAL_AFFAIRS",
    value: "International Affairs"
  },
  {
    key: "INTERNATIONAL_TRADE_DEVELOPMENT",
    value: "International Trade/Development"
  },
  {
    key: "INTERNET",
    value: "Internet"
  },
  {
    key: "INVESTMENT_BANKING_VENTURE",
    value: "Investment Banking/Venture"
  },
  {
    key: "INVESTMENT_MANAGEMENT_HEDGE_FUND_PRIVATE_EQUITY",
    value: "Investment Management/Hedge Fund/Private Equity"
  },
  {
    key: "JUDICIARY",
    value: "Judiciary"
  },
  {
    key: "LAW_ENFORCEMENT",
    value: "Law Enforcement"
  },
  {
    key: "LAW_PRACTICE_LAW_FIRMS",
    value: "Law Practice/Law Firms"
  },
  {
    key: "LEGAL_SERVICES",
    value: "Legal Services"
  },
  {
    key: "LEGISLATIVE_OFFICE",
    value: "Legislative Office"
  },
  {
    key: "LEISURE_TRAVEL",
    value: "Leisure/Travel"
  },
  {
    key: "LIBRARY",
    value: "Library"
  },
  {
    key: "LOGISTICS_PROCUREMENT",
    value: "Logistics/Procurement"
  },
  {
    key: "LUXURY_GOODS_JEWELRY",
    value: "Luxury Goods/Jewelry"
  },
  {
    key: "MACHINERY",
    value: "Machinery"
  },
  {
    key: "MANAGEMENT_CONSULTING",
    value: "Management Consulting"
  },
  {
    key: "MARITIME",
    value: "Maritime"
  },
  {
    key: "MARKETING_ADVERTISING_SALES",
    value: "Marketing/Advertising/Sales"
  },
  {
    key: "MARKET_RESEARCH",
    value: "Market Research"
  },
  {
    key: "MECHANICAL_OR_INDUSTRIAL_ENGINEERING",
    value: "Mechanical or Industrial Engineering"
  },
  {
    key: "MEDIA_PRODUCTION",
    value: "Media Production"
  },
  {
    key: "MEDICAL_EQUIPMENT",
    value: "Medical Equipment"
  },
  {
    key: "MEDICAL_PRACTICE",
    value: "Medical Practice"
  },
  {
    key: "MENTAL_HEALTH_CARE",
    value: "Mental Health Care"
  },
  {
    key: "MILITARY_INDUSTRY",
    value: "Military Industry"
  },
  {
    key: "MINING_METALS",
    value: "Mining/Metals"
  },
  {
    key: "MOTION_PICTURES_FILM",
    value: "Motion Pictures/Film"
  },
  {
    key: "MUSEUMS_INSTITUTIONS",
    value: "Museums/Institutions"
  },
  {
    key: "MUSIC",
    value: "Music"
  },
  {
    key: "NANOTECHNOLOGY",
    value: "Nanotechnology"
  },
  {
    key: "NEWSPAPERS_JOURNALISM",
    value: "Newspapers/Journalism"
  },
  {
    key: "NON-PROFIT_VOLUNTEERING",
    value: "Non-Profit/Volunteering"
  },
  {
    key: "OIL_ENERGY_SOLAR_GREENTECH",
    value: "Oil/Energy/Solar/Greentech"
  },
  {
    key: "ONLINE_PUBLISHING",
    value: "Online Publishing"
  },
  {
    key: "OTHER_NDUSTRY",
    value: "Other Industry"
  },
  {
    key: "OUTSOURCING_OFFSHORING",
    value: "Outsourcing/Offshoring"
  },
  {
    key: "PACKAGE_FREIGHT_DELIVERY",
    value: "Package/Freight Delivery"
  },
  {
    key: "PACKAGING_CONTAINERS",
    value: "Packaging/Containers"
  },
  {
    key: "PAPER_FOREST_PRODUCTS",
    value: "Paper/Forest Products"
  },
  {
    key: "PERFORMING_ARTS",
    value: "Performing Arts"
  },
  {
    key: "PHARMACEUTICALS",
    value: "Pharmaceuticals"
  },
  {
    key: "PHILANTHROPY",
    value: "Philanthropy"
  },
  {
    key: "PHOTOGRAPHY",
    value: "Photography"
  },
  {
    key: "PLASTICS",
    value: "Plastics"
  },
  {
    key: "POLITICAL_ORGANIZATION",
    value: "Political Organization"
  },
  {
    key: "PRIMARY_SECONDARY_EDUCATION",
    value: "Primary/Secondary Education"
  },
  {
    key: "PRINTING",
    value: "Printing"
  },
  {
    key: "PROFESSIONAL_RAINING",
    value: "Professional Training"
  },
  {
    key: "PROGRAM_DEVELOPMENT",
    value: "Program Development"
  },
  {
    key: "PUBLIC_RELATIONS_PR",
    value: "Public Relations/PR"
  },
  {
    key: "PUBLIC_SAFETY",
    value: "Public Safety"
  },
  {
    key: "PUBLISHING_INDUSTRY",
    value: "Publishing Industry"
  },
  {
    key: "RAILROAD_MANUFACTURE",
    value: "Railroad Manufacture"
  },
  {
    key: "RANCHING",
    value: "Ranching"
  },
  {
    key: "REAL_ESTATE_MORTGAGE",
    value: "Real Estate/Mortgage"
  },
  {
    key: "RECREATIONAL_FACILITIES_SERVICES",
    value: "Recreational Facilities/Services"
  },
  {
    key: "RELIGIOUS_INSTITUTIONS",
    value: "Religious Institutions"
  },
  {
    key: "RENEWABLES_ENVIRONMENT",
    value: "Renewables/Environment"
  },
  {
    key: "RESEARCH INDUSTRY",
    value: "Research Industry"
  },
  {
    key: "RESTAURANTS",
    value: "Restaurants"
  },
  {
    key: "RETAIL_INDUSTRY",
    value: "Retail Industry"
  },
  {
    key: "SECURITY_INVESTIGATIONS",
    value: "Security/Investigations"
  },
  {
    key: "SEMICONDUCTORS",
    value: "Semiconductors"
  },
  {
    key: "SHIPBUILDING",
    value: "Shipbuilding"
  },
  {
    key: "SPORTING_GOODS",
    value: "Sporting Goods"
  },
  {
    key: "SPORTS",
    value: "Sports"
  },
  {
    key: "STAFFING_RECRUITING",
    value: "Staffing/Recruiting"
  },
  {
    key: "SUPERMARKETS",
    value: "Supermarkets"
  },
  {
    key: "TELECOMMUNICATIONS",
    value: "Telecommunications"
  },
  {
    key: "TEXTILES",
    value: "Textiles"
  },
  {
    key: "THINK_TANKS",
    value: "Think Tanks"
  },
  {
    key: "TOBACCO",
    value: "Tobacco"
  },
  {
    key: "TRANSLATION_LOCALIZATION",
    value: "Translation/Localization"
  },
  {
    key: "TRANSPORTATION",
    value: "Transportation"
  },
  {
    key: "UTILITIES",
    value: "Utilities"
  },
  {
    key: "VENTURE_CAPITAL_VC",
    value: "Venture Capital/VC"
  },
  {
    key: "VETERINARY",
    value: "Veterinary"
  },
  {
    key: "WAREHOUSING",
    value: "Warehousing"
  },
  {
    key: "WHOLESALE",
    value: "Wholesale"
  },
  {
    key: "WINE_SPIRITS",
    value: "Wine/Spirits"
  },
  {
    key: "WIRELESS",
    value: "Wireless"
  },
  {
    key: "WRITING_EDITING",
    value: "Writing/Editing"
  }
];
export default IndustryList;
