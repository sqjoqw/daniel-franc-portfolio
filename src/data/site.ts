/**
 * Veškerý obsah webu žije zde — odděleno od prezentace.
 * Texty vychází ze skutečných zkušeností Daniela Francse (zdroj: původní web).
 */

export const identity = {
  initials: "DF",
  name: "Daniel Franc",
  role: "Student SSPŠ & Videomaker",
  email: "franc.da.2025@ssps.cz",
  tagline: "Vizuální tvorba s pevným technickým základem.",
  location: "Praha, Česko",
  portrait: "/portrait.jpg",
  portraitAlt: "Daniel Franc",
  school: { name: "Smíchovská SPŠ", url: "https://www.ssps.cz/" },
  linkedin: "https://www.linkedin.com/in/daniel-franc-a7a95a3b9/",
  instagram: "https://instagram.com/d.fraancc",
} as const;

export const hero = {
  line1: "Jsem Daniel.",
  line2Pre: "Tvořím videa a studuji IT na ",
  line2Link: "SSPŠ",
  line2Post: ".",
  description:
    "Produkuji a stříhám videa od konceptu po finální střih, vedu studentský tým a propojuji vizuální tvorbu s logickým IT myšlením.",
} as const;

export const music = {
  title: "Demo Loop",
  artist: "Daniel Franc — demo audio",
  src: "/audio/demo-loop.wav",
  // Sem přidej vlastní skladbu: soubor vlož do /public/audio a uprav cestu výš.
} as const;

export const weather = {
  city: "Praha",
  latitude: 50.0755,
  longitude: 14.4378,
  timezone: "Europe/Prague",
  // Náhradní data, pokud API není dostupné (reálné průměry pro Prahu v říjnu).
  fallback: [
    { day: "St", temp: 15, code: 3 },
    { day: "Čt", temp: 16, code: 61 },
    { day: "Pá", temp: 14, code: 3 },
    { day: "So", temp: 13, code: 0 },
    { day: "Ne", temp: 12, code: 3 },
    { day: "Po", temp: 14, code: 0 },
    { day: "Út", temp: 13, code: 3 },
  ] as Array<{ day: string; temp: number; code: number }>,
} as const;

export type DesktopIconDef = {
  label: string;
  type: "skill" | "portfolio" | "settings";
  /** Cíl kliknutí: id prvku v sekci Dovednosti, na který složka vede */
  target?: string;
  /** Podtitul zobrazený v otevřené složce */
  description?: string;
};

export const desktopIcons: DesktopIconDef[] = [
  {
    label: "Creative Direction",
    type: "skill",
    target: "skill-creative-direction",
    description: "Koncepty, vizuální směřování a budování značky.",
  },
  {
    label: "Video Production",
    type: "skill",
    target: "skill-video-production",
    description: "Natáčení, střih, zvuk a color grading v DaVinci Resolve.",
  },
  {
    label: "Marketing & Content",
    type: "skill",
    target: "skill-marketing-content",
    description: "Obsahová strategie, kampaně a sociální sítě.",
  },
  {
    label: "Leadership",
    type: "skill",
    target: "skill-leadership",
    description: "Vedení týmů, koordinace projektů a rozhodování.",
  },
  {
    label: "Digital & Web",
    type: "skill",
    target: "skill-digital-web",
    description: "Weby a digitální produkty — HTML, CSS, JavaScript.",
  },
  {
    label: "Creative Portfolio",
    type: "portfolio",
    description: "Galerie mé vizuální tvorby — fotky, grafika i videa.",
  },
  {
    label: "Tento počítač",
    type: "settings",
    description: "Nastavení systému a informace o počítači.",
  },
];

export const navLinks = [
  { label: "Domů", href: "#", icon: "home" },
  { label: "Praxe", href: "#praxe", icon: "work" },
  { label: "Dovednosti", href: "#dovednosti", icon: "achievements" },
  { label: "O mě", href: "#about", icon: "about" },
  { label: "Kontakt", href: "#cta", icon: "contact" },
] as const;

export const achievements = {
  id: "dovednosti",
  heading: "Dovednosti a zkušenosti",
  items: [
    {
      id: "skill-creative-direction",
      title: "Creative Direction",
      description: "Development of creative concepts, visual direction, and brand communication.",
      icon: "clapperboard",
      gradient: "linear-gradient(to bottom, #6FB6F9, #1E7BF6)",
    },
    {
      id: "skill-video-production",
      title: "Video Production & Post-Production",
      description: "End-to-end video production, from concept development and filming to editing, sound design, and color grading.",
      icon: "scissors",
      gradient: "linear-gradient(to bottom, #B57BEE, #8746D6)",
    },
    {
      id: "skill-marketing-content",
      title: "Marketing & Content Strategy",
      description: "Content creation, campaign planning, and brand development across social media platforms.",
      icon: "users",
      gradient: "linear-gradient(to bottom, #FC5D6E, #F23049)",
    },
    {
      id: "skill-leadership",
      title: "Leadership & Project Management",
      description: "Team leadership, task delegation, project coordination, and strategic decision-making.",
      icon: "code",
      gradient: "linear-gradient(to bottom, #FFD056, #F5A623)",
    },
    {
      id: "skill-digital-web",
      title: "Digital & Web Development",
      description: "Development of websites and digital experiences using HTML, CSS, and JavaScript.",
      icon: "heart",
      gradient: "linear-gradient(to bottom, #4FDE73, #1FB84A)",
    },
  ],
} as const;

export type Pillar = {
  id: string;
  label: string;
  superpower: string;
  heading: string;
  description: string;
  pills: Array<{ label: string; href: string }>;
  note: Array<{ title: string; description: string }>;
};

export const pillars: Pillar[] = [
  {
    id: "vizualni-tvorba",
    label: "Vizuální tvorba",
    superpower: "01",
    heading: "Tvořím od konceptu po finální výstup.",
    description:
      "Většina lidí mě zná s kamerou v ruce. Pro mě ale tvorba začíná mnohem dříve než samotným natáčením, ale u nápadu, konceptu a způsobu, jakým má výsledný obsah fungovat.",
    pills: [
      { label: "MultiVerbo →", href: "#praxe" },
      { label: "CZ.NIC →", href: "#praxe" },
      { label: "Volt Czechia →", href: "#praxe" },
    ],
    note: [
      {
        title: "MultiVerbo",
        description: "vedení kreativního a marketingového směru nově vznikajícího digitálního produktu",
      },
      {
        title: "CZ.NIC",
        description: "tvorba informačního videoobsahu a krátkých formátů pro sociální sítě",
      },
      {
        title: "Volt Czechia",
        description: "kreativní koncepty, produkce a postprodukce obsahu pro sociální sítě",
      },
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    superpower: "02",
    heading: "Nejen tvořím. Dokážu věci vést.",
    description:
      "Baví mě vzít nápad, dát dohromady lidi a posunout celý projekt od konceptu k výsledku. Přirozeně přebírám odpovědnost, organizuji práci a rozhoduji se ve chvíli, kdy není čas čekat.",
    pills: [{ label: "H2 Grand Prix →", href: "#praxe" }],
    note: [
      {
        title: "H2 Grand Prix",
        description: "vedení studentského týmu v mezinárodní technické soutěži",
      },
      {
        title: "Konferenční sál Radlice",
        description: "řízení provozu, organizace eventů a koordinace technického týmu",
      },
    ],
  },
  {
    id: "it-web",
    label: "IT & Web",
    superpower: "03",
    heading: "Technologie jsou moje druhá strana.",
    description:
      "Kreativita pro mě nekončí u vizuálu. Zajímá mě, jak věci fungují uvnitř, a technické znalosti využívám jako nástroj pro vlastní projekty a digitální tvorbu.",
    pills: [{ label: "Praxe →", href: "#praxe" }],
    note: [
      {
        title: "Vlastní digitální projekty",
        description: "návrh a vývoj webových prezentací a digitálních produktů",
      },
      {
        title: "Webové projekty",
        description: "propojení designu, funkčnosti a technického řešení",
      },
    ],
  },
  {
    id: "obsah-komunikace",
    label: "Marketing & komunikace",
    superpower: "04",
    heading: "Tvorba musí někam vést.",
    description:
      "Nestačí mi vytvořit něco, co dobře vypadá. Zajímá mě, komu to říkáme, proč by ho to mělo zajímat a jak z obsahu vytvořit něco, co skutečně funguje.",
    pills: [{ label: "Praxe →", href: "#praxe" }],
    note: [
      {
        title: "CZ.NIC",
        description: "převádění technologických a bezpečnostních témat do srozumitelného obsahu",
      },
      {
        title: "PR a obsahové projekty",
        description: "tvorba komunikace, sociálního obsahu a prezentace projektů veřejnosti",
      },
    ],
  },
];

export const portfolio = {
  id: "praxe",
  heading: "Praxe",
  note: "Nejsem jen člověk, který něco vytvoří. Zajímá mě celý proces — od prvního nápadu přes kreativní směr a realizaci až po výsledek.",
  items: [
    {
      name: "MultiVerbo",
      meta: "Chief Marketing Officer · 09/2026 – současnost",
      description:
        "Marketing, kreativní směřování značky, obsahová strategie a uvedení digitálního produktu na trh.",
    },
    {
      name: "CZ.NIC",
      meta: "Videomaker & Social Media Content Creator · 02/2026 – současnost",
      description:
        "Kompletní tvorba videoobsahu pro sociální sítě — od konceptu a produkce až po postprodukci.",
    },
    {
      name: "Volt Czechia",
      meta: "Social Media Content Creator · 05/2026 – současnost",
      description:
        "Tvorba obsahu pro sociální sítě, od kreativního konceptu přes natáčení až po finální zpracování.",
    },
    {
      name: "H2 Grand Prix",
      meta: "Project Team Lead · 03/2026 – současnost",
      description:
        "Vedení studentského týmu v mezinárodní technické soutěži, organizace práce, delegování úkolů a strategické rozhodování.",
    },
    {
      name: "Konferenční sál Radlice",
      meta: "Director & Operations Lead",
      description:
        "Řízení provozu, organizace akcí, komunikace s klienty a koordinace technického týmu.",
    },
    {
      name: "DDM hl. m. Prahy",
      meta: "Lektor · 09/2025 – 09/2026",
      description:
        "Vedení kroužků a workshopů zaměřených na technologie a digitální tvorbu.",
    },
    {
      name: "FAČR",
      meta: "Fotbalový rozhodčí · 03/2025 – 01/2026",
      description:
        "Rozhodování utkání, komunikace s hráči a práce pod časovým tlakem.",
    },
    {
      name: "JDEME BRUSLIT s.r.o.",
      meta: "Pokladní · 11/2025 – 12/2025",
      description:
        "Práce se zákazníky, obsluha pokladny a každodenní provoz.",
    },
  ],
} as const;

export const about = {
  windowTitle: "about-me.txt",
  sections: [
    {
      label: "Dřív",
      text: "Od malička mě bavily technologie. Postupem času jsem zjistil, že mě táhnou hlavně k vizuální tvorbě — začal jsem se věnovat produkci a postprodukci videí, kde propojuji technické znalosti s kreativitou.",
    },
    {
      label: "Teď",
      text: "Je mi 16 let a studuji obor informační technologie na Smíchovské SPŠ v Praze. Produkuji a stříhám videa pro CZ.NIC a Volt Czechia, vedu tým H2 Grand Prix, jsem členem PR týmu školy a vedu jako lektor aktivity pro mládež.",
    },
  ],
  future: {
    label: "Budoucnost",
    text: "Rád bych se živil primárně tvorbou mediálního obsahu — ale s pevným technickým a organizačním základem.",
  },
} as const;

export const footer = {
  links: [
    { label: "E-mail", href: `mailto:${identity.email}` },
    { label: "LinkedIn", href: identity.linkedin },
    { label: "Instagram", href: identity.instagram },
  ],
} as const;
