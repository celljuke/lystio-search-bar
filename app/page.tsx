"use client";

import { Map } from "@/components/map";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <main className="flex w-full h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Panel - Map */}
        <div className="hidden lg:block lg:w-[60%] xl:w-[65%] h-full relative">
          <Map
            accessToken={config.mapbox.accessToken}
            initialCenter={[16.3738, 48.2082]} // Vienna, Austria
            initialZoom={11}
            className="w-full h-full"
          />
        </div>

        {/* Right Panel - Property List */}
        <div className="w-full lg:w-[40%] xl:w-[35%] h-full overflow-y-auto bg-white">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Properties in Vienna
              </h2>
              <p className="text-sm text-gray-600">321 listings found</p>
            </div>

            {/* Property Cards Placeholder */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Property Title {i}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Vienna 1060</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>2 Rooms</span>
                        <span>62 m²</span>
                        <span>Floor 1</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-[#A540F3]">
                          €1,375
                        </span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
