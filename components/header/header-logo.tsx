"use client";

import Image from "next/image";

export function HeaderLogo() {
  return (
    <div className="flex flex-shrink-0 items-center self-start pt-6">
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
  );
}
