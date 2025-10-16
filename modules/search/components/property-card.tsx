"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building, Bed, Bath, Maximize, MapPin, Calendar } from "lucide-react";
import {
  formatPrice,
  formatPricePerSqm,
  formatSize,
  formatFloor,
  formatAddress,
  getPropertyTypeDisplay,
} from "../utils/filter-converter";

interface PropertyCardProps {
  property: any; // TODO: Use proper Property type from backend
  onClick?: () => void;
  className?: string;
}

export function PropertyCard({
  property,
  onClick,
  className,
}: PropertyCardProps) {
  const mainImage = property.media?.[0]?.cdnUrl;
  const hasImage = Boolean(mainImage);

  // Calculate days ago
  const daysAgo = Math.floor(
    (Date.now() - new Date(property.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Get agent/owner info
  const agent = property.user || property.owner;
  const agentName = property.user
    ? `${property.user.firstName} ${property.user.lastName}`
    : property.owner?.name;
  const agentImage = property.user?.imageUrl || property.owner?.imageUrl;

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100",
        className
      )}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {hasImage ? (
          <>
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.verified && (
            <Badge className="bg-white hover:bg-white text-purple-600 font-semibold shadow-md rounded-full">
              <Image
                src="/icons/verified.svg"
                alt="Verified"
                width={16}
                height={16}
                className="mr-1"
              />
              Verified
            </Badge>
          )}
          {property.tenementCount > 0 && (
            <Badge className="bg-black/50 hover:bg-black/40 text-white font-semibold shadow-md rounded-full">
              {property.tenementCount} Units
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement favorite toggle
          }}
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Agent Info Overlay */}
        {agent && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              {agentImage && (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <Image
                    src={agentImage}
                    alt={agentName || "Agent"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-white drop-shadow-lg">
                  {agentName}
                </p>
                {property.owner && (
                  <p className="text-xs text-white/90 drop-shadow-lg">
                    {property.owner.name}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-white drop-shadow-lg">
                {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPrice(property.rent)}
            </h3>
            {property.rentPer && (
              <span className="text-sm text-gray-500">
                {formatPricePerSqm(property.rentPer)}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {property.title}
        </h4>

        {/* Address */}
        <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {formatAddress(property.address, property.city, property.zip)}
          </span>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Size */}
          {property.size && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Maximize className="w-4 h-4 text-gray-400" />
              <span>{formatSize(property.size)}</span>
            </div>
          )}

          {/* Rooms */}
          {property.rooms && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Building className="w-4 h-4 text-gray-400" />
              <span>
                {property.rooms === 1 ? "1 Room" : `${property.rooms} Rooms`}
              </span>
            </div>
          )}

          {/* Bathrooms */}
          {property.roomsBath && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>
                {property.roomsBath === 1
                  ? "1 Bath"
                  : `${property.roomsBath} Baths`}
              </span>
            </div>
          )}

          {/* Bedrooms */}
          {property.roomsBed && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>
                {property.roomsBed === 1
                  ? "1 Bed"
                  : `${property.roomsBed} Beds`}
              </span>
            </div>
          )}
        </div>

        {/* Floor Info */}
        {property.floor !== null && property.floor !== undefined && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
            <span>{formatFloor(property.floor)}</span>
          </div>
        )}

        {/* Property Type */}
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            {getPropertyTypeDisplay(property.type, property.subType)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
