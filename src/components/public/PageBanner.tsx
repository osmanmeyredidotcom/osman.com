import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Full-width page banner (12-10, P11-X254: "Banner images to be use full
 * screen. no padding."): edge to edge with no surrounding padding, the
 * 2880 × 1350 banner proportion from tablet up and a taller 3:2 crop on
 * phones so Osman Meyredi stays prominent. The same shape as the Live Piano
 * banner. Anchored at the top of the photograph by default so his whole
 * head stays in frame at every width.
 */
export function PageBanner({
  src,
  alt,
  className = "",
  imageClassName = "object-top",
}: {
  src: string;
  alt: string;
  className?: string;
  /** object-position for the crop; defaults to the top of the photo. */
  imageClassName?: string;
}) {
  return (
    <Reveal variant="media">
      <div className={`relative w-full overflow-hidden bg-stage ${className}`}>
        <div className="relative aspect-[3/2] sm:aspect-[2880/1350]">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className={`object-cover ${imageClassName}`}
          />
        </div>
      </div>
    </Reveal>
  );
}
