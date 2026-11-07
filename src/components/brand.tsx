import Link from "next/link";
import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="brand" aria-label="Lucky Cable Daman home">
    <Image className={compact ? "official-logo compact-logo" : "official-logo"} src="/brand/lucky-cable-logo.png" width={1744} height={1192} alt="Lucky Cable Network — Future Ready" loading="eager" unoptimized />
  </Link>;
}