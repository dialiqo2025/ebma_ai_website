"use client";

import Image from "next/image";
import Link from "next/link";

export function Brand({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-max items-center"
      aria-label="ebma.ai home"
    >
      <Image
        src={compact ? "/ebma-icon.png" : "/ebma-logo-light.png"}
        alt="ebma.ai"
        width={compact ? 40 : 152}
        height={compact ? 40 : 42}
        className="block h-auto max-h-[42px] w-auto object-contain"
        priority
        unoptimized
      />
    </Link>
  );
}
