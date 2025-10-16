"use client";

import { Home, Heart, Globe, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface HeaderActionsProps {
  user?: UserProfile;
  favoritesCount?: number;
  onCreateListing?: () => void;
  onSignOut?: () => void;
}

export function HeaderActions({
  user = {
    name: "Selcuk",
    email: "selcuk@example.com",
    avatarUrl: "/images/selcuk_photo.jpeg",
  },
  favoritesCount = 21,
  onCreateListing,
  onSignOut,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-4 self-start pt-6">
      {/* Create Listing Button */}
      <Button
        variant="ghost"
        onClick={onCreateListing}
        className="relative px-4 py-2 h-auto text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-purple-50 font-medium text-base"
      >
        <Home className="w-5 h-5 mr-2" />
        Create Listing
        <Badge
          variant="default"
          className="absolute -top-2 -right-2 bg-[#8B5CF6] text-white text-xs px-2 py-0.5 rounded-full rotate-[10deg]"
        >
          It's FREE
        </Badge>
      </Button>

      {/* Favorites / Heart Icon */}
      <button
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Favorites"
      >
        <Heart className="w-6 h-6 text-gray-700" />
        {favoritesCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full"
          >
            {favoritesCount > 99 ? "99+" : favoritesCount}
          </Badge>
        )}
      </button>

      {/* Language Selector with Flag */}
      <button
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Change language"
      >
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-black"></div>
            <div className="flex-1 bg-red-600"></div>
            <div className="flex-1 bg-yellow-400"></div>
          </div>
          <Globe className="absolute inset-0 m-auto w-4 h-4 text-white mix-blend-difference" />
        </div>
      </button>

      {/* User Profile Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-full transition-colors"
            aria-label="User menu"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={user.avatarUrl}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56 p-0 bg-white border border-gray-200 rounded-xl shadow-lg"
        >
          <div className="py-2">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            {/* Menu Items */}
            <nav className="py-1" aria-label="User menu">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                My Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                My Listings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Favorites
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Settings
              </button>
            </nav>

            {/* Sign Out */}
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={onSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
