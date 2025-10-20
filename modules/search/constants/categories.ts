import {
  Building2,
  Home,
  Briefcase,
  Bed,
  DoorOpen,
  Building,
  Store,
  Palmtree,
  Map,
  ParkingCircle,
  TrendingUp,
} from "lucide-react";
import { Category } from "../types";

export const CATEGORIES: Category[] = [
  {
    id: "apartments",
    name: "Apartments",
    icon: Building2,
    count: 9547,
    typeId: 2, // APARTMENT type ID
    hasSubcategories: true,
    subcategories: [
      { id: "all", name: "All Subcategories", count: 9547 },
      { id: "wohnung", name: "Wohnung", count: 234, subTypeId: 47 },
      { id: "penthouse", name: "Penthouse", count: 159, subTypeId: 49 },
      {
        id: "genossenschaftswohnung",
        name: "Genossenschaftswohnung",
        count: 987,
        subTypeId: 50,
      },
      { id: "maisonette", name: "Maisonette", count: 857, subTypeId: 51 },
      { id: "loft-studio", name: "Loft/Studio", count: 147, subTypeId: 52 },
      { id: "dachgeschoss", name: "Dachgeschoss", count: 395, subTypeId: 53 },
      { id: "souterrain", name: "Souterrain", count: 753, subTypeId: 55 },
      { id: "erdgeschoss", name: "Erdgeschoß", count: 42, subTypeId: 54 },
      {
        id: "dachgeschoss-2",
        name: "Dachgeschoss",
        count: 468,
        subTypeId: 103,
      },
      {
        id: "sonstige-wohnungen",
        name: "Sonstige Wohnungen",
        count: 684,
        subTypeId: 200,
      },
    ],
  },
  {
    id: "houses",
    name: "Houses",
    icon: Home,
    count: 8275,
    typeId: 3, // HOUSE type ID
    hasSubcategories: true,
    subcategories: [
      { id: "all", name: "Select All", count: 8275 },
      { id: "townhouse", name: "Townhouse", count: 987, subTypeId: 3 },
      {
        id: "single-family-house",
        name: "Single Family House",
        count: 2345,
        subTypeId: 8,
      },
      {
        id: "multi-family-house",
        name: "Multi-Family House",
        count: 1876,
        subTypeId: 9,
      },
      { id: "farmhouse", name: "Farmhouse", count: 654, subTypeId: 6 },
      { id: "villa", name: "Villa", count: 432, subTypeId: 7 },
      {
        id: "shell-construction",
        name: "Shell Construction",
        count: 747,
        subTypeId: 10,
      },
      { id: "other-house", name: "Other House", count: 432, subTypeId: 200 },
    ],
  },
  {
    id: "short-term",
    name: "Short-Term Rental",
    icon: Bed,
    count: 6392,
    typeId: 0, // APARTMENT type ID
    hasSubcategories: false,
  },
  {
    id: "new-developments",
    name: "New Developments",
    icon: Building,
    count: 7529,
    typeId: 12, // APARTMENT type ID (default)
    hasSubcategories: false,
  },
  {
    id: "rooms",
    name: "Rooms/Co-Living",
    icon: DoorOpen,
    count: 1853,
    typeId: 1, // APARTMENT type ID
    hasSubcategories: false,
  },
  {
    id: "office",
    name: "Office",
    icon: Briefcase,
    count: 3012,
    typeId: 20, // COMMERCIAL type ID
    hasSubcategories: true,
    subcategories: [
      { id: "all", name: "Select All", count: 3012 },
      { id: "other-office", name: "Other Office", count: 456, subTypeId: 7 },
      {
        id: "office-practice",
        name: "Office/Practice",
        count: 1234,
        subTypeId: 7,
      },
      { id: "office-center", name: "Office Center", count: 567, subTypeId: 7 },
      { id: "loft-studio", name: "Loft/Studio", count: 234, subTypeId: 7 },
      {
        id: "coworking-space",
        name: "Coworking Space",
        count: 321,
        subTypeId: 7,
      },
      { id: "shared-office", name: "Shared Office", count: 200, subTypeId: 7 },
    ],
  },
  {
    id: "commercial",
    name: "Commercial Properties",
    icon: Store,
    count: 4960,
    typeId: 5, // COMMERCIAL type ID
    hasSubcategories: true,
    subcategories: [
      { id: "all", name: "Select All", count: 4960 },
      {
        id: "gastronomy-restaurant",
        name: "Gastronomy/Restaurant",
        count: 876,
        subTypeId: 8,
      },
      {
        id: "agriculture-forestry",
        name: "Agriculture/Forestry",
        count: 543,
        subTypeId: 13,
      },
      {
        id: "shop-retail-space",
        name: "Shop/Retail Space",
        count: 1234,
        subTypeId: 8,
      },
      {
        id: "hotels-guesthouses",
        name: "Hotels/Guesthouses",
        count: 654,
        subTypeId: 8,
      },
      {
        id: "warehouse-storage-hall",
        name: "Warehouse/Storage Hall",
        count: 789,
        subTypeId: 9,
      },
      {
        id: "exhibition-space",
        name: "Exhibition Space",
        count: 321,
        subTypeId: 8,
      },
      {
        id: "commercial-property",
        name: "Commercial Property",
        count: 543,
        subTypeId: 8,
      },
    ],
  },
  {
    id: "holiday-homes",
    name: "Holiday Homes",
    icon: Palmtree,
    count: 2638,
    typeId: 11, // HOUSE type ID
    hasSubcategories: false,
  },
  {
    id: "plots",
    name: "Plots",
    icon: Map,
    count: 3012,
    typeId: 4, // LAND type ID
    hasSubcategories: true,
    subcategories: [
      { id: "all", name: "Select All", count: 3012 },
      {
        id: "agricultural-land",
        name: "Agricultural Land",
        count: 543,
        subTypeId: 72,
      },
      {
        id: "building-plot",
        name: "Building Plot",
        count: 876,
        subTypeId: 201,
      },
      { id: "forest-land", name: "Forest Land", count: 234, subTypeId: 73 },
      {
        id: "commercial-plot",
        name: "Commercial Plot",
        count: 543,
        subTypeId: 202,
      },
      {
        id: "industrial-plot",
        name: "Industrial Plot",
        count: 125,
        subTypeId: 203,
      },
      { id: "other-plot", name: "Other Plot", count: 234, subTypeId: 200 },
    ],
  },
  {
    id: "parking",
    name: "Parking",
    icon: ParkingCircle,
    count: 3741,
    typeId: 13, // PARKING type ID
    hasSubcategories: true,
    subcategories: [
      { id: "all", name: "Select All", count: 3741 },
      {
        id: "single-garage",
        name: "Single Garage",
        count: 987,
        subTypeId: 153,
      },
      {
        id: "parking-space",
        name: "Parking Space",
        count: 1234,
        subTypeId: 155,
      },
      { id: "carport", name: "Carport", count: 456, subTypeId: 156 },
      {
        id: "double-garage",
        name: "Double Garage",
        count: 543,
        subTypeId: 154,
      },
      {
        id: "underground-garage",
        name: "Underground Garage",
        count: 321,
        subTypeId: 157,
      },
      {
        id: "underground-parking-space",
        name: "Underground Parking Space",
        count: 100,
        subTypeId: 158,
      },
      {
        id: "parking-space-charging-station",
        name: "Parking Space with Charging Station",
        count: 100,
        subTypeId: 159,
      },
    ],
  },
  {
    id: "investment",
    name: "Investment Properties",
    icon: TrendingUp,
    count: 5086,
    typeId: 21, // INVESTMENT type ID
    hasSubcategories: true,
    subcategories: [
      { id: "all", name: "Select All", count: 5086 },
      {
        id: "investment-property",
        name: "Investment Property",
        count: 2543,
        subTypeId: 114,
      },
      {
        id: "development-property",
        name: "Development Property",
        count: 1543,
        subTypeId: 115,
      },
      {
        id: "project-development",
        name: "Project Development",
        count: 1000,
        subTypeId: 116,
      },
    ],
  },
];
