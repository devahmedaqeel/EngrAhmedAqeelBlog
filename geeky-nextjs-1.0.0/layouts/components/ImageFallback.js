/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";

const ImageFallback = (props) => {
  const { src, fallback = "/images/placeholder.png", width, height, alt = "", className, priority, loading, ...rest } = props;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const processedSrc =
    src && src.startsWith("/") && !src.startsWith("//") && !src.startsWith("http")
      ? `${basePath}${src}`
      : src || fallback;

  const [imgSrc, setImgSrc] = useState(processedSrc);

  useEffect(() => {
    setImgSrc(processedSrc);
  }, [processedSrc]);

  return (
    <img
      {...rest}
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      // Only eager-load priority images; all others lazy
      loading={priority ? "eager" : loading || "lazy"}
      // Prevent layout shifts
      decoding="async"
      onError={() => {
        if (fallback && imgSrc !== fallback) setImgSrc(fallback);
      }}
    />
  );
};

export default ImageFallback;
