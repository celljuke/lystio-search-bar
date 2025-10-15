"use client";

import Image from "next/image";

export const TopBar = () => {
  return (
    <nav className="w-full divide-y bg-white sticky top-0 z-50 h-20 shadow-none lg:shadow-sm">
      <div className="flex justify-between px-10 py-3 transition-all duration-200 ease-in-out lg:h-full items-center h-[70px] opacity-100">
        <div className="flex flex-shrink-0 items-center">
          <a href="/">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={80}
              height={38}
              priority={true}
            />
          </a>
        </div>
      </div>
    </nav>
  );
};
