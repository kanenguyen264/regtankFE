interface IndustryItem {
  key: string;
  value: string;
}

const IndustryList: IndustryItem[] = [
  {
    key: "ACCOUNTING",
    value: "会计"
  },
  {
    key: "AIRLINES_AVIATION",
    value: "航空公司/航空"
  },
  {
    key: "ALTERNATIVE_DISPUTE_RESOLUTION",
    value: "替代性纠纷解决"
  },
  {
    key: "ALTERNATIVE_MEDICINE",
    value: "替代药物"
  },
  {
    key: "ANIMATION",
    value: "动画片"
  },
  {
    key: "APPAREL_FASHION",
    value: "服装/时装"
  },
  {
    key: "ARCHITECTURE_PLANNING",
    value: "建筑/规划"
  },
  {
    key: "ARTS_CRAFTS",
    value: "工艺品"
  },
  {
    key: "AUTOMOTIVE",
    value: "汽车行业"
  },
  {
    key: "AVIATION_AEROSPACE",
    value: "航空/航天"
  },
  {
    key: "BANKING_MORTGAGE",
    value: "银行/抵押"
  },
  {
    key: "BIOTECHNOLOGY_GREENTECH",
    value: "生物技术/绿色技术"
  },
  {
    key: "BROADCAST_MEDIA",
    value: "广播媒体"
  },
  {
    key: "BUILDING_MATERIALS",
    value: "建筑材料"
  },
  {
    key: "BUSINESS_SUPPLIES_EQUIPMENT",
    value: "商业用品/设备"
  },
  {
    key: "CAPITAL_MARKETS_HEDGE_FUND_PRIVATE_EQUITY",
    value: "资本市场/对冲基金/私募股权"
  },
  {
    key: "CHEMICALS",
    value: "化学制品"
  },
  {
    key: "CIVIC_SOCIAL_ORGANIZATION",
    value: "公民/社会组织"
  },
  {
    key: "CIVIL_ENGINEERING",
    value: "土木工程"
  },
  {
    key: "COMMERCIAL_REAL_ESTATE",
    value: "商业房地产"
  },
  {
    key: "COMPUTER_GAMES",
    value: "电脑游戏"
  },
  {
    key: "COMPUTER_HARDWARE",
    value: "电脑硬件"
  },
  {
    key: "COMPUTER_NETWORKING",
    value: "电脑网络"
  },
  {
    key: "COMPUTER_NETWORK_SECURITY",
    value: "计算机/网络安全"
  },
  {
    key: "COMPUTER_SOFTWARE_ENGINEERING",
    value: "电脑软件/工程"
  },
  {
    key: "CONSTRUCTION",
    value: "建造"
  },
  {
    key: "CONSUMER_ELECTRONICS",
    value: "消费类电子产品"
  },
  {
    key: "CONSUMER_GOODS",
    value: "消费品"
  },
  {
    key: "CONSUMER_SERVICES",
    value: "消费服务"
  },
  {
    key: "COSMETICS",
    value: "消费服务"
  },
  {
    key: "DAIRY",
    value: "乳业"
  },
  {
    key: "DEFENSE_SPACE",
    value: "国防/太空"
  },
  {
    key: "DESIGN",
    value: "设计"
  },
  {
    key: "EDUCATION_MANAGEMENT",
    value: "教育管理"
  },
  {
    key: "E-LEARNING",
    value: "电子学习"
  },
  {
    key: "ELECTRICAL_ELECTRONIC_MANUFACTURING",
    value: "电气/电子制造"
  },
  {
    key: "ENTERTAINMENT_MOVIE_PRODUCTION",
    value: "娱乐/电影制作"
  },
  {
    key: "ENVIRONMENTAL_SERVICES",
    value: "环境服务"
  },
  {
    key: "EVENTS_SERVICES",
    value: "活动服务"
  },
  {
    key: "EXECUTIVE_OFFICE",
    value: "行政办公室"
  },
  {
    key: "FACILITIES_SERVICES",
    value: "设施服务"
  },
  {
    key: "FARMING",
    value: "农业"
  },
  {
    key: "FINANCIAL_SERVICES",
    value: "金融服务"
  },
  {
    key: "FINE_ART",
    value: "美术"
  },
  {
    key: "FISHERY",
    value: "水产"
  },
  {
    key: "FOOD_BEVERAGES",
    value: "食品/饮料"
  },
  {
    key: "FOOD_PRODUCTION",
    value: "食品生产"
  },
  {
    key: "FUNDRAISING",
    value: "筹款活动"
  },
  {
    key: "FURNITURE",
    value: "家具"
  },
  {
    key: "GAMBLING_CASINOS",
    value: "赌博/赌场"
  },
  {
    key: "GLASS_CERAMICS_CONCRETE",
    value: "玻璃/陶瓷/混凝土"
  },
  {
    key: "GOVERNMENT_ADMINISTRATION",
    value: "政府行政"
  },
  {
    key: "GOVERNMENT_RELATIONS",
    value: "政府关系"
  },
  {
    key: "GRAPHIC_DESIGN_WEB_DESIGN",
    value: "平面设计/网页设计"
  },
  {
    key: "HEALTH_FITNESS",
    value: "健康与健身"
  },
  {
    key: "HIGHER_EDUCATION_ACADAMIA",
    value: "高等教育/学术界"
  },
  {
    key: "HOSPITAL_HEALTH_CARE",
    value: "医院/卫生保健"
  },
  {
    key: "HOSPITALITY",
    value: "款待"
  },
  {
    key: "HUMAN_RESOURCES_HR",
    value: "人力资源/人力资源"
  },
  {
    key: "IMPORT_EXPORT",
    value: "进出口"
  },
  {
    key: "INDIVCODEUAL_FAMILY_SERVICES",
    value: "个人/家庭服务"
  },
  {
    key: "INDUSTRIAL_AUTOMATION",
    value: "工业自动化"
  },
  {
    key: "INFORMATION_SERVICES",
    value: "资讯服务"
  },
  {
    key: "INFORMATION_TECHNOLOGY_IT",
    value: "信息技术/信息技术"
  },
  {
    key: "INSURANCE",
    value: "保险"
  },
  {
    key: "INTERNATIONAL_AFFAIRS",
    value: "国际事务"
  },
  {
    key: "INTERNATIONAL_TRADE_DEVELOPMENT",
    value: "International Trade/Development"
  },
  {
    key: "INTERNET",
    value: "互联网"
  },
  {
    key: "INVESTMENT_BANKING_VENTURE",
    value: "投资银行/风险投资"
  },
  {
    key: "INVESTMENT_MANAGEMENT_HEDGE_FUND_PRIVATE_EQUITY",
    value: "投资管理/对冲基金/私募股权"
  },
  {
    key: "JUDICIARY",
    value: "司法"
  },
  {
    key: "LAW_ENFORCEMENT",
    value: "执法"
  },
  {
    key: "LAW_PRACTICE_LAW_FIRMS",
    value: "律师事务所/律师事务所"
  },
  {
    key: "LEGAL_SERVICES",
    value: "法律服务"
  },
  {
    key: "LEGISLATIVE_OFFICE",
    value: "立法机关"
  },
  {
    key: "LEISURE_TRAVEL",
    value: "休闲/旅行"
  },
  {
    key: "LIBRARY",
    value: "图书馆"
  },
  {
    key: "LOGISTICS_PROCUREMENT",
    value: "物流/采购"
  },
  {
    key: "LUXURY_GOODS_JEWELRY",
    value: "奢侈品/珠宝"
  },
  {
    key: "MACHINERY",
    value: "机械"
  },
  {
    key: "MANAGEMENT_CONSULTING",
    value: "管理咨询"
  },
  {
    key: "MARITIME",
    value: "海上"
  },
  {
    key: "MARKETING_ADVERTISING_SALES",
    value: "营销/广告/销售"
  },
  {
    key: "MARKET_RESEARCH",
    value: "市场调查"
  },
  {
    key: "MECHANICAL_OR_INDUSTRIAL_ENGINEERING",
    value: "机械或工业工程"
  },
  {
    key: "MEDIA_PRODUCTION",
    value: "媒体制作"
  },
  {
    key: "MEDICAL_EQUIPMENT",
    value: "医疗设备"
  },
  {
    key: "MEDICAL_PRACTICE",
    value: "医学实践"
  },
  {
    key: "MENTAL_HEALTH_CARE",
    value: "心理保健"
  },
  {
    key: "MILITARY_INDUSTRY",
    value: "军工"
  },
  {
    key: "MINING_METALS",
    value: "采矿/金属"
  },
  {
    key: "MOTION_PICTURES_FILM",
    value: "电影/电影"
  },
  {
    key: "MUSEUMS_INSTITUTIONS",
    value: "Museums/Institutions"
  },
  {
    key: "MUSIC",
    value: "音乐"
  },
  {
    key: "NANOTECHNOLOGY",
    value: "纳米技术"
  },
  {
    key: "NEWSPAPERS_JOURNALISM",
    value: "报纸/新闻"
  },
  {
    key: "NON-PROFIT_VOLUNTEERING",
    value: "非营利/志愿服务"
  },
  {
    key: "OIL_ENERGY_SOLAR_GREENTECH",
    value: "石油/能源/太阳能/绿色科技"
  },
  {
    key: "ONLINE_PUBLISHING",
    value: "在线出版"
  },
  {
    key: "OTHER_NDUSTRY",
    value: "其他产业"
  },
  {
    key: "OUTSOURCING_OFFSHORING",
    value: "外包/离岸"
  },
  {
    key: "PACKAGE_FREIGHT_DELIVERY",
    value: "包装/货运"
  },
  {
    key: "PACKAGING_CONTAINERS",
    value: "包装/容器"
  },
  {
    key: "PAPER_FOREST_PRODUCTS",
    value: "纸/林产品"
  },
  {
    key: "PERFORMING_ARTS",
    value: "表演艺术"
  },
  {
    key: "PHARMACEUTICALS",
    value: "医药品"
  },
  {
    key: "PHILANTHROPY",
    value: "慈善事业"
  },
  {
    key: "PHOTOGRAPHY",
    value: "摄影"
  },
  {
    key: "PLASTICS",
    value: "塑胶制品"
  },
  {
    key: "POLITICAL_ORGANIZATION",
    value: "政治组织"
  },
  {
    key: "PRIMARY_SECONDARY_EDUCATION",
    value: "小学/中学教育"
  },
  {
    key: "PRINTING",
    value: "印刷"
  },
  {
    key: "PROFESSIONAL_RAINING",
    value: "专业培训"
  },
  {
    key: "PROGRAM_DEVELOPMENT",
    value: "程序开发"
  },
  {
    key: "PUBLIC_RELATIONS_PR",
    value: "公共关系/公关"
  },
  {
    key: "PUBLIC_SAFETY",
    value: "公共安全"
  },
  {
    key: "PUBLISHING_INDUSTRY",
    value: "出版业"
  },
  {
    key: "RAILROAD_MANUFACTURE",
    value: "铁路制造"
  },
  {
    key: "RANCHING",
    value: "牧场"
  },
  {
    key: "REAL_ESTATE_MORTGAGE",
    value: "房地产/抵押"
  },
  {
    key: "RECREATIONAL_FACILITIES_SERVICES",
    value: "娱乐设施/服务"
  },
  {
    key: "RELIGIOUS_INSTITUTIONS",
    value: "宗教机构"
  },
  {
    key: "RENEWABLES_ENVIRONMENT",
    value: "可再生能源/环境"
  },
  {
    key: "RESEARCH INDUSTRY",
    value: "研究产业"
  },
  {
    key: "RESTAURANTS",
    value: "餐馆"
  },
  {
    key: "RETAIL_INDUSTRY",
    value: "零售业"
  },
  {
    key: "SECURITY_INVESTIGATIONS",
    value: "安全/调查"
  },
  {
    key: "SEMICONDUCTORS",
    value: "半导体类"
  },
  {
    key: "SHIPBUILDING",
    value: "造船"
  },
  {
    key: "SPORTING_GOODS",
    value: "体育用品"
  },
  {
    key: "SPORTS",
    value: "运动的"
  },
  {
    key: "STAFFING_RECRUITING",
    value: "人员/招聘"
  },
  {
    key: "SUPERMARKETS",
    value: "超级市场"
  },
  {
    key: "TELECOMMUNICATIONS",
    value: "电信"
  },
  {
    key: "TEXTILES",
    value: "纺织品类"
  },
  {
    key: "THINK_TANKS",
    value: "智库"
  },
  {
    key: "TOBACCO",
    value: "烟草"
  },
  {
    key: "TRANSLATION_LOCALIZATION",
    value: "翻译/本地化"
  },
  {
    key: "TRANSPORTATION",
    value: "运输"
  },
  {
    key: "UTILITIES",
    value: "实用工具"
  },
  {
    key: "VENTURE_CAPITAL_VC",
    value: "风险投资/风险投资"
  },
  {
    key: "VETERINARY",
    value: "兽医"
  },
  {
    key: "WAREHOUSING",
    value: "入库"
  },
  {
    key: "WHOLESALE",
    value: "批发的"
  },
  {
    key: "WINE_SPIRITS",
    value: "葡萄酒/烈酒"
  },
  {
    key: "WIRELESS",
    value: "无线的s"
  },
  {
    key: "WRITING_EDITING",
    value: "写作/编辑"
  }
];

export default IndustryList;
