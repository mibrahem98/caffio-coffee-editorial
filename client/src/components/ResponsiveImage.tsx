import type { ImgHTMLAttributes } from "react";
import type { ResponsiveImageSet } from "@/lib/responsiveImages";

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes"> & {
  image: ResponsiveImageSet;
  sizes?: string;
};

const toSrcSet = (sources: ResponsiveImageSet["avif"]) => sources.map(({ src, width }) => `${src} ${width}w`).join(", ");

export default function ResponsiveImage({ image, sizes = image.sizes, ...imageProps }: ResponsiveImageProps) {
  return <picture>
    <source type="image/avif" srcSet={toSrcSet(image.avif)} sizes={sizes} />
    <source type="image/webp" srcSet={toSrcSet(image.webp)} sizes={sizes} />
    <img {...imageProps} src={image.fallback} sizes={sizes} />
  </picture>;
}
