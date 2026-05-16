export type StormEntry = {
  slug: string;
  name: string;
  fullName: string;
  year: number;
  season: string;
  basin: "NA" | "EP" | "WP" | "NI" | "SI" | "SP";
  categorySaffir: number | null;
  classification: string;
  wikiTitle: string;
  isFeatured?: boolean;
  displayOrder?: number;
};

export const STORMS: StormEntry[] = [
  // === North Atlantic ===
  { slug: "hurricane-mitch-1998",    name: "Mitch",    fullName: "Hurricane Mitch",    year: 1998, season: "1998 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Mitch" },
  { slug: "hurricane-floyd-1999",    name: "Floyd",    fullName: "Hurricane Floyd",    year: 1999, season: "1999 Atlantic", basin: "NA", categorySaffir: 4, classification: "Hurricane", wikiTitle: "Hurricane_Floyd" },
  { slug: "hurricane-isabel-2003",   name: "Isabel",   fullName: "Hurricane Isabel",   year: 2003, season: "2003 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Isabel" },
  { slug: "hurricane-charley-2004",  name: "Charley",  fullName: "Hurricane Charley",  year: 2004, season: "2004 Atlantic", basin: "NA", categorySaffir: 4, classification: "Hurricane", wikiTitle: "Hurricane_Charley" },
  { slug: "hurricane-ivan-2004",     name: "Ivan",     fullName: "Hurricane Ivan",     year: 2004, season: "2004 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Ivan" },
  { slug: "hurricane-katrina-2005",  name: "Katrina",  fullName: "Hurricane Katrina",  year: 2005, season: "2005 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Katrina",  isFeatured: true, displayOrder: 1 },
  { slug: "hurricane-rita-2005",     name: "Rita",     fullName: "Hurricane Rita",     year: 2005, season: "2005 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Rita" },
  { slug: "hurricane-wilma-2005",    name: "Wilma",    fullName: "Hurricane Wilma",    year: 2005, season: "2005 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Wilma" },
  { slug: "hurricane-dean-2007",     name: "Dean",     fullName: "Hurricane Dean",     year: 2007, season: "2007 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Dean_(2007)" },
  { slug: "hurricane-sandy-2012",    name: "Sandy",    fullName: "Hurricane Sandy",    year: 2012, season: "2012 Atlantic", basin: "NA", categorySaffir: 3, classification: "Hurricane", wikiTitle: "Hurricane_Sandy" },
  { slug: "hurricane-matthew-2016",  name: "Matthew",  fullName: "Hurricane Matthew",  year: 2016, season: "2016 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Matthew" },
  { slug: "hurricane-harvey-2017",   name: "Harvey",   fullName: "Hurricane Harvey",   year: 2017, season: "2017 Atlantic", basin: "NA", categorySaffir: 4, classification: "Hurricane", wikiTitle: "Hurricane_Harvey" },
  { slug: "hurricane-irma-2017",     name: "Irma",     fullName: "Hurricane Irma",     year: 2017, season: "2017 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Irma" },
  { slug: "hurricane-maria-2017",    name: "Maria",    fullName: "Hurricane Maria",    year: 2017, season: "2017 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Maria" },
  { slug: "hurricane-michael-2018",  name: "Michael",  fullName: "Hurricane Michael",  year: 2018, season: "2018 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Michael_(2018)" },
  { slug: "hurricane-dorian-2019",   name: "Dorian",   fullName: "Hurricane Dorian",   year: 2019, season: "2019 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Dorian" },
  { slug: "hurricane-ian-2022",      name: "Ian",      fullName: "Hurricane Ian",      year: 2022, season: "2022 Atlantic", basin: "NA", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Ian_(2022)" },
  { slug: "hurricane-otis-2023",     name: "Otis",     fullName: "Hurricane Otis",     year: 2023, season: "2023 Pacific",  basin: "EP", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Otis" },
  // === Western Pacific ===
  { slug: "typhoon-linda-1997",      name: "Linda",    fullName: "Typhoon Linda",      year: 1997, season: "1997 Pacific",  basin: "WP", categorySaffir: null, classification: "Typhoon", wikiTitle: "Tropical_Storm_Linda_(1997)" },
  { slug: "typhoon-saomai-2000",     name: "Saomai",   fullName: "Typhoon Saomai",     year: 2000, season: "2000 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Saomai_(2000)" },
  { slug: "typhoon-xangsane-2006",   name: "Xangsane", fullName: "Typhoon Xangsane",   year: 2006, season: "2006 Pacific",  basin: "WP", categorySaffir: 4, classification: "Typhoon", wikiTitle: "Typhoon_Xangsane" },
  { slug: "typhoon-durian-2006",     name: "Durian",   fullName: "Typhoon Durian",     year: 2006, season: "2006 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Durian" },
  { slug: "typhoon-ketsana-2009",    name: "Ketsana",  fullName: "Typhoon Ketsana",    year: 2009, season: "2009 Pacific",  basin: "WP", categorySaffir: 2, classification: "Typhoon", wikiTitle: "Typhoon_Ketsana" },
  { slug: "typhoon-megi-2010",       name: "Megi",     fullName: "Typhoon Megi",       year: 2010, season: "2010 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Megi_(2010)" },
  { slug: "typhoon-bopha-2012",      name: "Bopha",    fullName: "Typhoon Bopha",      year: 2012, season: "2012 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Bopha" },
  { slug: "typhoon-haiyan-2013",     name: "Haiyan",   fullName: "Typhoon Haiyan",     year: 2013, season: "2013 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Haiyan",  isFeatured: true, displayOrder: 2 },
  { slug: "typhoon-damrey-2017",     name: "Damrey",   fullName: "Typhoon Damrey",     year: 2017, season: "2017 Pacific",  basin: "WP", categorySaffir: 2, classification: "Typhoon", wikiTitle: "Typhoon_Damrey_(2017)" },
  { slug: "typhoon-mangkhut-2018",   name: "Mangkhut", fullName: "Typhoon Mangkhut",   year: 2018, season: "2018 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Mangkhut" },
  { slug: "typhoon-goni-2020",       name: "Goni",     fullName: "Typhoon Goni",       year: 2020, season: "2020 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Goni" },
  { slug: "typhoon-rai-2021",        name: "Rai",      fullName: "Typhoon Rai",        year: 2021, season: "2021 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Rai" },
  { slug: "typhoon-noru-2022",       name: "Noru",     fullName: "Typhoon Noru",       year: 2022, season: "2022 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Noru_(2022)" },
  { slug: "typhoon-doksuri-2023",    name: "Doksuri",  fullName: "Typhoon Doksuri",    year: 2023, season: "2023 Pacific",  basin: "WP", categorySaffir: 4, classification: "Typhoon", wikiTitle: "Typhoon_Doksuri" },
  { slug: "typhoon-yagi-2024",       name: "Yagi",     fullName: "Typhoon Yagi",       year: 2024, season: "2024 Pacific",  basin: "WP", categorySaffir: 5, classification: "Typhoon", wikiTitle: "Typhoon_Yagi" },
  // === Eastern Pacific ===
  { slug: "hurricane-linda-1997",    name: "Linda",    fullName: "Hurricane Linda",    year: 1997, season: "1997 Pacific",  basin: "EP", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Linda_(1997)" },
  { slug: "hurricane-kenna-2002",    name: "Kenna",    fullName: "Hurricane Kenna",    year: 2002, season: "2002 Pacific",  basin: "EP", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Kenna" },
  { slug: "hurricane-patricia-2015", name: "Patricia", fullName: "Hurricane Patricia", year: 2015, season: "2015 Pacific",  basin: "EP", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Patricia", isFeatured: true, displayOrder: 3 },
  { slug: "hurricane-willa-2018",    name: "Willa",    fullName: "Hurricane Willa",    year: 2018, season: "2018 Pacific",  basin: "EP", categorySaffir: 5, classification: "Hurricane", wikiTitle: "Hurricane_Willa" },
  { slug: "hurricane-hilary-2023",   name: "Hilary",   fullName: "Hurricane Hilary",   year: 2023, season: "2023 Pacific",  basin: "EP", categorySaffir: 4, classification: "Hurricane", wikiTitle: "Hurricane_Hilary_(2023)" },
  // === North Indian ===
  { slug: "cyclone-nargis-2008",     name: "Nargis",   fullName: "Cyclone Nargis",     year: 2008, season: "2008 Indian",   basin: "NI", categorySaffir: 4, classification: "Cyclone", wikiTitle: "Cyclone_Nargis" },
  { slug: "cyclone-phailin-2013",    name: "Phailin",  fullName: "Cyclone Phailin",    year: 2013, season: "2013 Indian",   basin: "NI", categorySaffir: 4, classification: "Cyclone", wikiTitle: "Cyclone_Phailin" },
  { slug: "cyclone-fani-2019",       name: "Fani",     fullName: "Cyclone Fani",       year: 2019, season: "2019 Indian",   basin: "NI", categorySaffir: 4, classification: "Cyclone", wikiTitle: "Cyclone_Fani" },
  { slug: "cyclone-amphan-2020",     name: "Amphan",   fullName: "Cyclone Amphan",     year: 2020, season: "2020 Indian",   basin: "NI", categorySaffir: 5, classification: "Cyclone", wikiTitle: "Cyclone_Amphan" },
  // === South Indian ===
  { slug: "cyclone-gafilo-2004",     name: "Gafilo",   fullName: "Cyclone Gafilo",     year: 2004, season: "2004 Indian",   basin: "SI", categorySaffir: 5, classification: "Cyclone", wikiTitle: "Cyclone_Gafilo" },
  { slug: "cyclone-idai-2019",       name: "Idai",     fullName: "Cyclone Idai",       year: 2019, season: "2019 Indian",   basin: "SI", categorySaffir: 4, classification: "Cyclone", wikiTitle: "Cyclone_Idai" },
  { slug: "cyclone-kenneth-2019",    name: "Kenneth",  fullName: "Cyclone Kenneth",    year: 2019, season: "2019 Indian",   basin: "SI", categorySaffir: 4, classification: "Cyclone", wikiTitle: "Cyclone_Kenneth" },
  { slug: "cyclone-freddy-2023",     name: "Freddy",   fullName: "Cyclone Freddy",     year: 2023, season: "2023 Indian",   basin: "SI", categorySaffir: 5, classification: "Cyclone", wikiTitle: "Cyclone_Freddy" },
  // === South Pacific ===
  { slug: "cyclone-pam-2015",        name: "Pam",      fullName: "Cyclone Pam",        year: 2015, season: "2015 Pacific",  basin: "SP", categorySaffir: 5, classification: "Cyclone", wikiTitle: "Cyclone_Pam" },
  { slug: "cyclone-winston-2016",    name: "Winston",  fullName: "Cyclone Winston",    year: 2016, season: "2016 Pacific",  basin: "SP", categorySaffir: 5, classification: "Cyclone", wikiTitle: "Cyclone_Winston" },
  { slug: "cyclone-harold-2020",     name: "Harold",   fullName: "Cyclone Harold",     year: 2020, season: "2020 Pacific",  basin: "SP", categorySaffir: 5, classification: "Cyclone", wikiTitle: "Cyclone_Harold" },
  { slug: "cyclone-gabrielle-2023",  name: "Gabrielle",fullName: "Cyclone Gabrielle",  year: 2023, season: "2023 Pacific",  basin: "SP", categorySaffir: 3, classification: "Cyclone", wikiTitle: "Cyclone_Gabrielle_(2023)" },
];
