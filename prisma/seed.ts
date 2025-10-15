import {
  HeatingDistribution,
  HeatingSource,
  PropertySubType,
  PropertyType,
} from "@/lib/generated/prisma";
import { prisma } from "../lib/prisma";

// Helper function to generate property tags
function generatePropertyTags(
  propertyType: any,
  condition: string,
  hasAgent: boolean
): string[] {
  const tags = [];

  if (hasAgent) tags.push("byAgent");
  if (condition === "NEW") tags.push("new");
  if (condition === "EXCELLENT") tags.push("excellent");
  if (Math.random() > 0.6) tags.push("verified");
  if (Math.random() > 0.7) tags.push("manyPhotos");
  if (Math.random() > 0.8) tags.push("tour");
  if (propertyType.subType === "PENTHOUSE") tags.push("penthouse");
  if (propertyType.subType === "MAISONETTE") tags.push("maisonette");
  if (Math.random() > 0.5) tags.push("balcony");
  if (Math.random() > 0.6) tags.push("terrace");
  if (Math.random() > 0.7) tags.push("garage");
  if (Math.random() > 0.8) tags.push("elevator");
  if (Math.random() > 0.9) tags.push("cellar");

  return tags;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.tenement.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.energyData.deleteMany();
  await prisma.propertySpace.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.media.deleteMany();
  await prisma.property.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.billingAddress.deleteMany();
  await prisma.company.deleteMany();
  await prisma.searchFilter.deleteMany();
  await prisma.searchAgent.deleteMany();

  console.log("🧹 Cleared existing data");

  // Create Amenities
  const amenities = await Promise.all([
    prisma.amenity.create({
      data: {
        name: "Balcony",
        description: "Private balcony with outdoor space",
        category: "Outdoor",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Terrace",
        description: "Private terrace area",
        category: "Outdoor",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Garden",
        description: "Private garden space",
        category: "Outdoor",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Parking",
        description: "Private parking space",
        category: "Parking",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Garage",
        description: "Private garage",
        category: "Parking",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Elevator",
        description: "Building elevator access",
        category: "Building",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Air Conditioning",
        description: "Air conditioning system",
        category: "Climate",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Heating",
        description: "Central heating system",
        category: "Climate",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Internet",
        description: "High-speed internet connection",
        category: "Technology",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Washing Machine",
        description: "Built-in washing machine",
        category: "Appliances",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Dishwasher",
        description: "Built-in dishwasher",
        category: "Appliances",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Furnished",
        description: "Fully furnished apartment",
        category: "Furnishing",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Pet Friendly",
        description: "Pets allowed",
        category: "Policy",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Smoking Allowed",
        description: "Smoking permitted",
        category: "Policy",
      },
    }),
    prisma.amenity.create({
      data: {
        name: "Security",
        description: "Building security system",
        category: "Security",
      },
    }),
  ]);

  console.log("✅ Created amenities");

  // Create Companies
  const schantlCompany = await prisma.company.create({
    data: {
      externalId: "schantl-ith-001",
      name: "Schantl ITH Immobilientreuhand GmbH",
      country: "at",
      email: "office@schantl-ith.at",
      contactEmail: "office@schantl-ith.at",
      phone: "+43 664 3070009",
      description:
        "Wir von Schantl ITH Immobilientreuhand GmbH sind ein dynamisches Familienunternehmen mit steirischen Wurzeln und einem Standort im Herzen Wiens und im schönen Graz! Unsere beiden Gesellschaftsführenden Gesellschafter Frau Maria Schantl MSc und Samir Agha-Schantl legen besonders großen Wert auf hohe Beratungsqualität, individuelle Betreuung und ein Full-Service Angebot für unsere Kunden.",
      vat: "ATU71263189",
      website: "https://www.schantl-ith.at/",
      imageUrl:
        "https://cdn.lystio.at/photos/company/9488/Ovxi3rsw8xzc-dV0.png",
      logoColor: "#f8f8f8",
      address: "Passauer Platz 6, 1010 Wien",
      countProperties: 49,
      billingAddress: {
        create: {
          address: "Passauer Platz 6",
          zip: "1010",
          city: "Wien",
          name: "Schantl ITH Immobilientreuhand GmbH",
        },
      },
    },
  });

  const nestorCompany = await prisma.company.create({
    data: {
      externalId: "nestor-001",
      name: "NESTOR Immobilien GmbH & Co KG",
      country: "at",
      email: "office@nestor.at",
      contactEmail: "office@nestor.at",
      phone: "+43 1 234 5678",
      description:
        "Herzlich Willkommen bei NESTOR Immobilien! Unsere Jahrelange Erfahrung sowie unser globales Netzwerk machen den entscheidenden Unterschied aus. NESTOR Immobilien begleitet Sie aus Leidenschaft beim kompletten Prozess und steht Ihnen unterstützend zur Seite.",
      vat: "ATU12345678",
      website: "https://www.nestor.at/",
      imageUrl: "https://cdn.lystio.at/photos/company/nestor/logo.png",
      logoColor: "#0066cc",
      address: "Mariahilfer Straße 1, 1060 Wien",
      countProperties: 127,
      billingAddress: {
        create: {
          address: "Mariahilfer Straße 1",
          zip: "1060",
          city: "Wien",
          name: "NESTOR Immobilien GmbH & Co KG",
        },
      },
    },
  });

  const ehlCompany = await prisma.company.create({
    data: {
      externalId: "ehl-001",
      name: "EHL Wohnen GmbH",
      country: "at",
      email: "M.Roll@ehl.at",
      contactEmail: "M.Roll@ehl.at",
      phone: "+43-1-512 76 90",
      description:
        "EHL Immobilien ist einer der führenden Immobiliendienstleister Österreichs und auf Gewerbe-, Investment-, und Wohnimmobilien spezialisiert. Seit mehr als 30 Jahren stehen wir für höchsten Anspruch an Qualität, Unabhängigkeit sowie hochprofessionelles und persönliches Service.",
      vat: "ATU73207102",
      website: "https://www.ehl.at/",
      imageUrl: "https://cdn.lystio.at/photos/company/32/hPE8W4ee9ppUHmlD.jpeg",
      logoColor: "#f8f8f8",
      address: "Prinz-Eugen-Straße 8/10, 1040 Wien",
      countProperties: 3816,
      billingAddress: {
        create: {
          address: "Prinz-Eugen-Straße 8/10",
          zip: "1040",
          city: "Wien",
          name: "EHL Wohnen GmbH",
        },
      },
    },
  });

  console.log("✅ Created companies");

  // Create Users
  const ursulaUser = await prisma.user.create({
    data: {
      externalId: "f6e9afef-9e34-4ed0-867f-a89eb26acf85",
      firstName: "Ursula",
      lastName: "Seiwald",
      contactEmail: "ursula.seiwald@schantl-ith.at",
      phone: "+43 664 5725475",
      imageUrl: "https://cdn.lystio.at/photos/user/9565/XYN2FA9whVC7wXf1.jpg",
      subtype: "COMPANY",
      companyId: schantlCompany.id,
      languages: ["de", "en"],
    },
  });

  const liliyaUser = await prisma.user.create({
    data: {
      externalId: "liliya-001",
      firstName: "Liliya",
      lastName: "Mytsko",
      contactEmail: "liliya@nestor.at",
      phone: "+43 1 234 5679",
      imageUrl: "https://cdn.lystio.at/photos/user/nestor/liliya.jpg",
      subtype: "COMPANY",
      companyId: nestorCompany.id,
      languages: ["de", "en", "ru", "uk"],
    },
  });

  const ilseUser = await prisma.user.create({
    data: {
      externalId: "93b3f164-f68e-4fc6-a075-2da1830e7685",
      firstName: "Ilse",
      lastName: "Reindl",
      contactEmail: "i.reindl@ehl.at",
      phone: "+43 1 5127690 410",
      imageUrl: "https://cdn.lystio.at/photos/user/49/nuwN0P39aOVr2ti2.jpg",
      subtype: "COMPANY",
      companyId: ehlCompany.id,
      languages: ["de", "en"],
    },
  });

  console.log("✅ Created users");

  // Create Properties
  const penthouseProperty = await prisma.property.create({
    data: {
      externalId2: "288562",
      title:
        "Luxuriöses Penthouse in 1010 Wien mit Dachterrasse und Privatlift",
      abstract:
        "Das schönste Dach Wiens gehört Ihnen – Exquisite Eleganz im exklusiven Penthouse des 1. Bezirks – 3D-Tour ansehen! Erleben Sie Wohnen auf höchstem Niveau – Ihr exklusives Penthouse in der Schellinggasse 12, 1010 Wien. Willkommen in einer Residenz, die neue Maßstäbe für luxuriöses Wohnen setzt.",
      address: "Schellinggasse 12",
      zip: "1010",
      city: "Wien",
      country: "at",
      rooms: 6,
      roomsBath: 3,
      roomsToilet: 5,
      size: 362.51,
      rent: 15900000, // €159,000 in cents
      rentCalculated: [43860.86, 43860.86],
      location: [16.374239866952614, 48.20350145437288],
      locationIsExact: false,
      locationAccuracy: 5,
      type: "APARTMENT",
      subType: "PENTHOUSE",
      condition: "EXCELLENT",
      rentType: "BUY",
      status: "ACTIVE",
      heatingSource: "DISTRICT_HEATING",
      heatingDistribution: "UNDERFLOOR_HEATING",
      availableFrom: new Date("2024-01-01"),
      availableFromText: "SOFORT",
      active: true,
      listed: true,
      verified: false,
      constructionYear: 2020,
      floor: 17,
      allowAppointments: true,
      urlSegments: ["wohnung", "wien", "innere-stadt-1010"],
      tenementCount: 1,
      isFavorite: false,
      hasAlert: false,
      sizeRange: [362.51, 362.51],
      rentRange: [15900000, 15900000],
      rentPerRange: [],
      roomsRange: [6, 6],
      roomsBathRange: [3, 3],
      roomsBedRange: [],
      rentPer: [],
      tags: ["verified", "byAgent", "cellar", "terrace", "manyPhotos", "tour"],
      requests: null,
      rentDisplay: [15900000, 15900000],
      rentPerDisplay: [43860.86, 43860.86],
      earliestAppointment: new Date("2025-10-15T18:00:00.000Z"),
      ownerId: schantlCompany.id,
      userId: ursulaUser.id,
    },
  });

  const apartmentProperty = await prisma.property.create({
    data: {
      externalId2: "288560",
      title:
        "Premium-Penthouse in Wien 1 Schellinggasse – 362 m², 248 m² Terrasse",
      abstract:
        "Exquisite Elegance above Vienna's Rooftops – Your Private Luxury Penthouse in the Heart of the 1st District – Click for 3D-Tour! Experience extraordinary living comfort in this unique penthouse at Schellinggasse 12, located in the exclusive 1st district of Vienna.",
      address: "Schellinggasse 12",
      zip: "1010",
      city: "Wien",
      country: "at",
      rooms: 6,
      roomsBath: 3,
      roomsToilet: 5,
      size: 362.51,
      rent: 15900000,
      rentCalculated: [43860.86, 43860.86],
      location: [16.374239866952614, 48.20350145437288],
      locationIsExact: false,
      locationAccuracy: 5,
      type: "APARTMENT",
      subType: "PENTHOUSE",
      condition: "EXCELLENT",
      rentType: "BUY",
      status: "ACTIVE",
      heatingSource: "DISTRICT_HEATING",
      heatingDistribution: "UNDERFLOOR_HEATING",
      availableFrom: new Date("2024-01-01"),
      availableFromText: "SOFORT",
      active: true,
      listed: true,
      verified: false,
      constructionYear: 2020,
      floor: 17,
      allowAppointments: true,
      urlSegments: ["wohnung", "wien", "innere-stadt-1010"],
      tenementCount: 1,
      isFavorite: false,
      hasAlert: false,
      sizeRange: [362.51, 362.51],
      rentRange: [15900000, 15900000],
      rentPerRange: [],
      roomsRange: [6, 6],
      roomsBathRange: [3, 3],
      roomsBedRange: [],
      rentPer: [],
      tags: ["verified", "byAgent", "cellar", "terrace", "manyPhotos", "tour"],
      requests: null,
      rentDisplay: [15900000, 15900000],
      rentPerDisplay: [43860.86, 43860.86],
      earliestAppointment: new Date("2025-10-15T18:00:00.000Z"),
      ownerId: schantlCompany.id,
      userId: ursulaUser.id,
    },
  });

  const modernApartment = await prisma.property.create({
    data: {
      externalId2: "89055",
      title: "Helle 3-Zimmer-Wohnung mit Balkon in Wien-Augarten, Erstbezug",
      abstract:
        "Eingebettet zwischen dem Donaukanal, dem grünen Augarten und dem pulsierenden 1. Wiener Gemeindebezirk vereint das LeopoldQuartier Natur, Urbanität und höchste Lebensqualität. Stephansdom, Kärntner Straße und die kulinarischen Hotspots des Servitenviertels sind fußläufig erreichbar.",
      address: "Obere Donaustraße 23",
      addressStair: "1",
      zip: "1020",
      city: "Wien",
      country: "at",
      rooms: 3,
      roomsBath: 1,
      roomsToilet: 2,
      roomHeight: 2.6,
      size: 81.46,
      rent: 780000, // €7,800 in cents
      rentCalculated: [9575.25, 9575.25],
      location: [16.374239866952614, 48.20350145437288],
      locationIsExact: false,
      locationAccuracy: 5,
      type: "APARTMENT",
      subType: "APARTMENT",
      condition: "NEW",
      rentType: "BUY",
      status: "ACTIVE",
      heatingSource: "HEAT_PUMP",
      heatingDistribution: "UNDERFLOOR_HEATING",
      availableFrom: new Date("2026-06-01"),
      availableFromText: "Q2/2026",
      active: true,
      listed: true,
      verified: true,
      constructionYear: 2026,
      floor: 1,
      allowAppointments: true,
      urlSegments: ["wohnung", "wien", "leopoldstadt-1020"],
      tenementCount: 1,
      isFavorite: false,
      hasAlert: false,
      sizeRange: [81.46, 81.46],
      rentRange: [780000, 780000],
      rentPerRange: [],
      roomsRange: [3, 3],
      roomsBathRange: [1, 1],
      roomsBedRange: [],
      rentPer: [],
      tags: [
        "commisionFree",
        "verified",
        "subway",
        "byAgent",
        "balcony",
        "manyPhotos",
        "tour",
      ],
      requests: null,
      rentDisplay: [780000, 780000],
      rentPerDisplay: [9575.25, 9575.25],
      earliestAppointment: new Date("2025-10-15T18:00:00.000Z"),
      ownerId: ehlCompany.id,
      userId: ilseUser.id,
    },
  });

  // Create 100+ Properties across Vienna districts
  const viennaDistricts = [
    { zip: "1010", name: "Innere Stadt", coords: [16.3742, 48.2082] },
    { zip: "1020", name: "Leopoldstadt", coords: [16.38, 48.21] },
    { zip: "1030", name: "Landstraße", coords: [16.39, 48.2] },
    { zip: "1040", name: "Wieden", coords: [16.37, 48.195] },
    { zip: "1050", name: "Margareten", coords: [16.36, 48.19] },
    { zip: "1060", name: "Mariahilf", coords: [16.35, 48.2] },
    { zip: "1070", name: "Neubau", coords: [16.34, 48.205] },
    { zip: "1080", name: "Josefstadt", coords: [16.33, 48.21] },
    { zip: "1090", name: "Alsergrund", coords: [16.36, 48.22] },
    { zip: "1100", name: "Favoriten", coords: [16.38, 48.18] },
    { zip: "1110", name: "Simmering", coords: [16.42, 48.17] },
    { zip: "1120", name: "Meidling", coords: [16.32, 48.175] },
    { zip: "1130", name: "Hietzing", coords: [16.28, 48.185] },
    { zip: "1140", name: "Penzing", coords: [16.25, 48.2] },
    { zip: "1150", name: "Rudolfsheim-Fünfhaus", coords: [16.32, 48.195] },
    { zip: "1160", name: "Ottakring", coords: [16.3, 48.21] },
    { zip: "1170", name: "Hernals", coords: [16.31, 48.22] },
    { zip: "1180", name: "Währing", coords: [16.32, 48.23] },
    { zip: "1190", name: "Döbling", coords: [16.35, 48.24] },
    { zip: "1200", name: "Brigittenau", coords: [16.39, 48.24] },
    { zip: "1210", name: "Floridsdorf", coords: [16.4, 48.25] },
    { zip: "1220", name: "Donaustadt", coords: [16.45, 48.22] },
    { zip: "1230", name: "Liesing", coords: [16.28, 48.14] },
  ];

  const propertyTypes = [
    {
      type: "APARTMENT",
      subType: "APARTMENT",
      basePrice: 400000,
      sizeRange: [45, 120],
    },
    {
      type: "APARTMENT",
      subType: "PENTHOUSE",
      basePrice: 1200000,
      sizeRange: [150, 400],
    },
    {
      type: "APARTMENT",
      subType: "MAISONETTE",
      basePrice: 600000,
      sizeRange: [80, 150],
    },
    {
      type: "HOUSE",
      subType: "DETACHED_HOUSE",
      basePrice: 800000,
      sizeRange: [120, 300],
    },
    {
      type: "HOUSE",
      subType: "TERRACED_HOUSE",
      basePrice: 500000,
      sizeRange: [80, 180],
    },
    {
      type: "HOUSE",
      subType: "VILLA",
      basePrice: 1500000,
      sizeRange: [200, 500],
    },
  ];

  const streetNames = [
    "Stephansplatz",
    "Graben",
    "Kärntner Straße",
    "Mariahilfer Straße",
    "Ringstraße",
    "Praterstraße",
    "Landstraßer Hauptstraße",
    "Favoritenstraße",
    "Ottakringer Straße",
    "Währinger Straße",
    "Döblinger Hauptstraße",
    "Floridsdorfer Hauptstraße",
    "Hietzinger Hauptstraße",
    "Penzing",
    "Rudolfsheim",
    "Hernalser Hauptstraße",
    "Josefstädter Straße",
    "Neubaugasse",
    "Margaretenstraße",
    "Wiedner Hauptstraße",
    "Landstraßer Hauptstraße",
    "Leopoldstädter Straße",
    "Simmeringer Hauptstraße",
    "Meidlinger Hauptstraße",
    "Liesinger Hauptstraße",
    "Donaustädter Straße",
  ];

  const propertyTitles = [
    "Moderne Wohnung mit Balkon",
    "Helle 3-Zimmer-Wohnung",
    "Luxuriöses Penthouse",
    "Gemütliche Maisonette",
    "Elegante Dachgeschosswohnung",
    "Neubauwohnung mit Terrasse",
    "Altbauwohnung mit Charme",
    "Top-renovierte Wohnung",
    "Erstbezug Neubau",
    "Wohnung mit Garten",
    "Penthouse mit Dachterrasse",
    "Loft-Charakter Wohnung",
    "Wohnung mit Stadtblick",
    "Ruhige Wohnung im Innenhof",
    "Wohnung mit Parkplatz",
    "Wohnung mit Keller",
    "Wohnung mit Aufzug",
    "Wohnung mit Balkon",
    "Wohnung mit Loggia",
    "Wohnung mit Terrasse",
    "Wohnung mit Garage",
    "Wohnung mit Tiefgarage",
    "Wohnung mit Stellplatz",
    "Wohnung mit Gartenanteil",
  ];

  const properties = [];
  const propertyCount = 100;

  for (let i = 0; i < propertyCount; i++) {
    const district =
      viennaDistricts[Math.floor(Math.random() * viennaDistricts.length)];
    const propertyType =
      propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const streetName =
      streetNames[Math.floor(Math.random() * streetNames.length)];
    const title =
      propertyTitles[Math.floor(Math.random() * propertyTitles.length)];

    // Generate realistic property data
    const size =
      Math.round(
        (propertyType.sizeRange[0] +
          Math.random() *
            (propertyType.sizeRange[1] - propertyType.sizeRange[0])) *
          100
      ) / 100;
    const basePrice = propertyType.basePrice;
    const priceVariation = 0.7 + Math.random() * 0.6; // ±30% variation
    const rent = Math.round(basePrice * priceVariation);
    const rentPerM2 = Math.round((rent / size) * 100) / 100;

    const rooms = Math.max(
      1,
      Math.floor(size / 25) + Math.floor(Math.random() * 2)
    );
    const roomsBath = Math.max(
      1,
      Math.floor(rooms / 2) + Math.floor(Math.random() * 2)
    );
    const roomsToilet = roomsBath + Math.floor(Math.random() * 2);

    // Generate realistic coordinates within district
    const coordVariation = 0.01;
    const location = [
      district.coords[0] + (Math.random() - 0.5) * coordVariation,
      district.coords[1] + (Math.random() - 0.5) * coordVariation,
    ];

    const address = `${streetName} ${Math.floor(Math.random() * 200) + 1}`;
    const constructionYear = 1950 + Math.floor(Math.random() * 75);
    const condition =
      constructionYear > 2010
        ? "NEW"
        : constructionYear > 2000
        ? "EXCELLENT"
        : constructionYear > 1990
        ? "GOOD"
        : "NEEDS_RENOVATION";

    const company = [schantlCompany, nestorCompany, ehlCompany][
      Math.floor(Math.random() * 3)
    ];
    const user = [ursulaUser, liliyaUser, ilseUser][
      Math.floor(Math.random() * 3)
    ];

    const property = await prisma.property.create({
      data: {
        externalId2: `prop-${1000 + i}`,
        title: `${title} in ${district.zip} Wien`,
        abstract: `Schöne ${propertyType.subType.toLowerCase()} in ${
          district.name
        }. Diese ${rooms}-Zimmer-Wohnung mit ${size} m² bietet modernen Komfort in zentraler Lage. Perfekt für ${
          rooms <= 2
            ? "Singles oder Paare"
            : rooms <= 3
            ? "kleine Familien"
            : "größere Familien"
        }.`,
        address: address,
        zip: district.zip,
        city: "Wien",
        country: "at",
        rooms: rooms,
        roomsBath: roomsBath,
        roomsToilet: roomsToilet,
        size: size,
        rent: rent,
        rentCalculated: [rentPerM2, rentPerM2],
        location: location,
        locationIsExact: Math.random() > 0.3,
        locationAccuracy: Math.floor(Math.random() * 5) + 1,
        type: propertyType.type as PropertyType,
        subType: propertyType.subType as PropertySubType,
        condition: condition,
        rentType: Math.random() > 0.3 ? "BUY" : "RENT",
        status: "ACTIVE",
        heatingSource: ["DISTRICT_HEATING", "GAS", "HEAT_PUMP", "ELECTRIC"][
          Math.floor(Math.random() * 4)
        ] as HeatingSource,
        heatingDistribution: [
          "RADIATORS",
          "UNDERFLOOR_HEATING",
          "AIR_CONDITIONING",
        ][Math.floor(Math.random() * 3)] as HeatingDistribution,
        availableFrom: new Date(
          Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000
        ),
        availableFromText: Math.random() > 0.5 ? "SOFORT" : "NACH VEREINBARUNG",
        active: true,
        listed: true,
        verified: Math.random() > 0.4,
        constructionYear: constructionYear,
        floor: Math.floor(Math.random() * 8) + 1,
        allowAppointments: true,
        urlSegments: [
          "wohnung",
          "wien",
          `${district.name.toLowerCase()}-${district.zip}`,
        ],
        tenementCount: 1,
        isFavorite: false,
        hasAlert: false,
        sizeRange: [size, size],
        rentRange: [rent, rent],
        rentPerRange: [rentPerM2, rentPerM2],
        roomsRange: [rooms, rooms],
        roomsBathRange: [roomsBath, roomsBath],
        roomsBedRange: [Math.max(1, rooms - 1), Math.max(1, rooms - 1)],
        rentPer: [rentPerM2, rentPerM2],
        tags: generatePropertyTags(
          propertyType,
          condition,
          Math.random() > 0.5
        ),
        requests: Math.floor(Math.random() * 10),
        rentDisplay: [rent, rent],
        rentPerDisplay: [rentPerM2, rentPerM2],
        earliestAppointment: new Date(
          Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
        ),
        ownerId: company.id,
        userId: user.id,
      },
    });

    properties.push(property);
  }

  console.log(
    `✅ Created ${properties.length} properties across Vienna districts`
  );

  // Create Property Spaces for all properties
  for (const property of properties) {
    const hasCellar = Math.random() > 0.6;
    const hasParking = Math.random() > 0.4;
    const hasTerrace = Math.random() > 0.5;
    const hasBalcony = Math.random() > 0.3;
    const hasGarage = Math.random() > 0.7;

    await prisma.propertySpace.create({
      data: {
        propertyId: property.id,
        cellarsCount: hasCellar ? Math.floor(Math.random() * 2) + 1 : null,
        cellarsArea: hasCellar
          ? Math.round((Math.random() * 30 + 10) * 100) / 100
          : null,
        cellarsType: hasCellar
          ? Math.random() > 0.8
            ? "wine_cellar"
            : "storage"
          : null,
        parkingsCount: hasParking ? Math.floor(Math.random() * 3) + 1 : null,
        parkingsArea: hasParking
          ? Math.round((Math.random() * 20 + 10) * 100) / 100
          : null,
        garagesCount: hasGarage ? Math.floor(Math.random() * 2) + 1 : null,
        garagesArea: hasGarage
          ? Math.round((Math.random() * 25 + 15) * 100) / 100
          : null,
        terracesCount: hasTerrace ? Math.floor(Math.random() * 2) + 1 : null,
        terracesArea: hasTerrace
          ? Math.round((Math.random() * 50 + 10) * 100) / 100
          : null,
        balconiesCount: hasBalcony ? Math.floor(Math.random() * 2) + 1 : null,
        balconiesArea: hasBalcony
          ? Math.round((Math.random() * 15 + 5) * 100) / 100
          : null,
      },
    });
  }

  console.log("✅ Created property spaces");

  // Create Energy Data for all properties
  for (const property of properties) {
    const isNew = property.constructionYear && property.constructionYear > 2010;
    const hwb = isNew ? 20 + Math.random() * 30 : 30 + Math.random() * 50;
    const fgee = isNew ? 0.3 + Math.random() * 0.4 : 0.5 + Math.random() * 0.5;

    await prisma.energyData.create({
      data: {
        propertyId: property.id,
        hwb: Math.round(hwb * 100) / 100,
        hwbClass: Math.floor(hwb / 25) + 1,
        fgee: Math.round(fgee * 100) / 100,
        fgeeClass: Math.floor(fgee * 10) + 1,
      },
    });
  }

  console.log("✅ Created energy data");

  // Create Media for all properties using real URLs from example response
  const mediaUrls = [
    // Property 93373 (Luxury Penthouse)
    "https://cdn.lystio.at/photos/tenement/93373/sK0Cl17nqYhHJQyM.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/qfX6EPBhCPnAr5u1.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/gjVy8KwGQazC60cs.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/c5uF7fBwwVifjM6-.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/4Zu_WF6aZ2j9DnRo.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/CpruBIPnEtum0Gs8.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/SBm4-ZSpOu3oRIm7.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/W-AnCaBqAALOFkMo.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/jw7_EzQUuluiQuHe.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/1fTx51kohDo1sUEO.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/2wsMteb8Bmybdv18.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/tCvkkw5grTjdT1wr.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/JJuTSwNYnorYyVor.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/qoPtmDoG2Z72adgi.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/Y1NaKjDJTUMqHxlp.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/CZZaYz0sJSPjozin.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/WU0928KR-c3JE8tJ.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/r_l_oi_StcXj3ul0.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/VKzsmuW-yAxnGX0Y.jpeg",
    "https://cdn.lystio.at/photos/tenement/93373/f7oNw7VylKR3CKvo.jpeg",

    // Property 93372 (Premium Penthouse)
    "https://cdn.lystio.at/photos/tenement/93372/SBm4-ZSpOu3oRIm7.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/4Zu_WF6aZ2j9DnRo.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/2wsMteb8Bmybdv18.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/c5uF7fBwwVifjM6-.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/b_HY8OAoBugTjyoQ.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/u1UQAWWnR3r9cSzq.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/IPDQ-ozpLbjGXdWh.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/rRmfdlXN_mfWjNRL.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/zllPqvbwlEq8pmoM.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/CpruBIPnEtum0Gs8.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/ALLY5TsypzZII48S.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/sVMTsEVZmKddQqrq.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/MSpV8spQg98tkEQy.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/ZGF9633f5Ra8IEbw.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/Ytx22U9MuY0C2bzT.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/pF8u4wVeMWbAH8-c.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/IA2Hxf5N_hXFpmQT.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/aLrUKnuv_pvV7bKQ.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/1SgDkdZtsjk7__LP.jpeg",
    "https://cdn.lystio.at/photos/tenement/93372/i2b4_waaMw4eYWVz.jpeg",

    // Property 16802 (Modern Apartment)
    "https://cdn.lystio.at/photos/tenement/16802/mmcpORJanLh_z3Ex.jpg",
    "https://cdn.lystio.at/photos/tenement/16802/8M83t6fkk9e-XmNl.jpg",
    "https://cdn.lystio.at/photos/tenement/16802/f6u2IwXPRpIJUi-O.jpg",
    "https://cdn.lystio.at/photos/tenement/16802/YWUy-s-RJVGC65Do.jpg",
    "https://cdn.lystio.at/photos/tenement/16802/ZvmrGsWf-ef3LK0H.jpg",
    "https://cdn.lystio.at/photos/tenement/16802/6B2UAyRqnv4BfyDX.jpg",
    "https://cdn.lystio.at/photos/tenement/16802/XvnVXqolrOqEGImo.jpg",

    // Property 16832 (Another Apartment)
    "https://cdn.lystio.at/photos/tenement/16832/bl2lOmCz94m2eQGG.jpg",
    "https://cdn.lystio.at/photos/tenement/16832/8M83t6fkk9e-XmNl.jpg",
    "https://cdn.lystio.at/photos/tenement/16832/6B2UAyRqnv4BfyDX.jpg",
    "https://cdn.lystio.at/photos/tenement/16832/XvnVXqolrOqEGImo.jpg",

    // Property 16823 (House)
    "https://cdn.lystio.at/photos/tenement/16823/PCp6knGwaGz-LNqc.jpg",
    "https://cdn.lystio.at/photos/tenement/16823/sJ67u2q1ag1iH8ZT.jpg",
    "https://cdn.lystio.at/photos/tenement/16823/t3YQTVlQ_cFn2a6k.jpg",
    "https://cdn.lystio.at/photos/tenement/16823/g3Iryy02B_TdTuFB.jpg",
    "https://cdn.lystio.at/photos/tenement/16823/lK6jIlTHEo5ZACNf.jpg",
    "https://cdn.lystio.at/photos/tenement/16823/s9oAtF4THPk8rbf9.jpg",

    // Property 91594 (Luxury Apartment)
    "https://cdn.lystio.at/photos/tenement/91594/KKzEgjGv9X5NLxZv.jpeg",
    "https://cdn.lystio.at/photos/tenement/91594/2Y4S0gaYMakoi2NV.jpeg",
    "https://cdn.lystio.at/photos/tenement/91594/0TkYPLBFZO82ciRK.jpeg",
    "https://cdn.lystio.at/photos/tenement/91594/taNkVzIB02PYRxEF.jpeg",
    "https://cdn.lystio.at/photos/tenement/91594/TnZwEB5ZgRg0GJZw.jpeg",
    "https://cdn.lystio.at/photos/tenement/91594/kp7m_PHC0vBoGed3.jpeg",
    "https://cdn.lystio.at/photos/tenement/91594/Sj0vZc7yGFpU6JG9.jpeg",
    "https://cdn.lystio.at/photos/tenement/91594/lJA9i44Tg-V-h8ok.jpeg",

    // Property 91592 (Modern Apartment)
    "https://cdn.lystio.at/photos/tenement/91592/mz83jx0Hb6Xrn_a4.jpeg",
    "https://cdn.lystio.at/photos/tenement/91592/LbiJ3HPzdrHhjRLW.jpeg",
    "https://cdn.lystio.at/photos/tenement/91592/t1pfNz2HtZiQ3xN8.jpeg",
    "https://cdn.lystio.at/photos/tenement/91592/ucXHRIYVoVriCfTR.jpeg",
    "https://cdn.lystio.at/photos/tenement/91592/sdwQM5vXE1_4UOlF.jpeg",
    "https://cdn.lystio.at/photos/tenement/91592/rjPDLFuG5VBVVDex.jpeg",
    "https://cdn.lystio.at/photos/tenement/91592/0RUme4jHeOwEtjzR.jpeg",
    "https://cdn.lystio.at/photos/tenement/91592/tPOyevRTjyBVUsRk.jpeg",

    // Property 91588 (Apartment)
    "https://cdn.lystio.at/photos/tenement/91588/ezf8WA6XI3I_Tiez.jpeg",
    "https://cdn.lystio.at/photos/tenement/91588/5vbFwKeFbC7kLOV4.jpeg",
    "https://cdn.lystio.at/photos/tenement/91588/YTOs2zYMeKDMzx8o.jpeg",
    "https://cdn.lystio.at/photos/tenement/91588/1lntSXTe7O5xQJwM.jpeg",
    "https://cdn.lystio.at/photos/tenement/91588/I3TN05NK-K0dRcwJ.jpeg",
    "https://cdn.lystio.at/photos/tenement/91588/ZMV82h1MB7tOW8Tf.jpeg",
  ];

  for (const property of properties) {
    const photoCount = Math.floor(Math.random() * 8) + 3; // 3-10 photos per property

    for (let i = 0; i < photoCount; i++) {
      const randomUrl = mediaUrls[Math.floor(Math.random() * mediaUrls.length)];
      await prisma.media.create({
        data: {
          type: "PHOTO",
          cdnUrl: randomUrl,
          bluredDataURL:
            "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANABQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAUCBgcI/8QAJRAAAQMCBQUBAQAAAAAAAAAAAQIDBAARBQYSITEUIkFRYTKB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAeEQABBAMAAwEAAAAAAAAAAAAAAQACAxFBBBIxMrHw/9oADAMBAAIRAxEAPwDq+aloriWy+wmTWoKtlsACORf5jNqNym9FmlPZ5p0rONLoVZI/IlTUDJamQphiXBKdpJaSTz6uOIapq8w4ZR26UqZJ2FKQLfQiEZRtdYz9SqiAkto4VSxRJINI3zs1kIBVtasAfXdCIhOp50pT448GELD9PXX1GME98r//2Q==",
          propertyId: property.id,
        },
      });
    }
  }

  console.log("✅ Created media");

  // Create Property Amenities for all properties
  for (const property of properties) {
    const amenityCount = Math.floor(Math.random() * 8) + 4; // 4-11 amenities per property
    const selectedAmenities = [];

    // Always include some basic amenities
    selectedAmenities.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);

    // Randomly select amenities
    for (let i = 0; i < amenityCount; i++) {
      const randomAmenity = Math.floor(Math.random() * amenities.length);
      if (!selectedAmenities.includes(randomAmenity)) {
        selectedAmenities.push(randomAmenity);
      }
    }

    for (const amenityIndex of selectedAmenities) {
      await prisma.propertyAmenity.create({
        data: {
          propertyId: property.id,
          amenityId: amenities[amenityIndex].id,
        },
      });
    }
  }

  console.log("✅ Created property amenities");

  // Create Tenements for all properties
  for (const property of properties) {
    await prisma.tenement.create({
      data: {
        propertyId: property.id,
        data: {},
      },
    });
  }

  console.log("✅ Created tenements");

  // Create Search Filters
  await prisma.searchFilter.create({
    data: {
      name: "Luxury Apartments Vienna",
      filters: {
        type: [2],
        rentType: ["buy"],
        subType: [46, 47, 49, 50, 51, 52, 53, 55, 103, 200],
        showPriceOnRequest: true,
        sort: "most_recent",
        bbox: [
          [16.366722026305894, 48.20237326421042],
          [16.381600823010785, 48.21541332868213],
        ],
      },
    },
  });

  console.log("✅ Created search filters");

  // Create Search Agents
  await prisma.searchAgent.create({
    data: {
      userId: ursulaUser.id,
      name: "Luxury Properties Alert",
      filters: {
        type: [2],
        rentType: ["buy"],
        subType: [49], // Penthouse
        rent: { min: 10000000, max: 50000000 }, // €100k - €500k
        city: "Wien",
      },
      email: "ursula.seiwald@schantl-ith.at",
      active: true,
    },
  });

  console.log("✅ Created search agents");

  console.log("🎉 Database seeding completed successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${amenities.length} amenities`);
  console.log(`   - 3 companies`);
  console.log(`   - 3 users`);
  console.log(`   - ${properties.length} properties across Vienna districts`);
  console.log(`   - Property spaces, energy data, media, and relationships`);
  console.log(`   - Search filters and agents`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
