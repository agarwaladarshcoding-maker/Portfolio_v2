import Image from "next/image";

// The two studio headshots, duotoned into the palette by `.portrait` in
// globals.css. Contained, not full-bleed — the consuming layout decides how
// big this gets; this component only fixes the source, its true pixel
// dimensions (so the browser reserves space before the image loads), and the
// frame.
type Props = {
  variant: "hero" | "square";
  priority?: boolean;
  className?: string;
};

const sources: Record<Props["variant"], { src: string; width: number; height: number; sizes: string }> = {
  hero: {
    src: "/img/adarsh-portrait.webp",
    width: 639,
    height: 853,
    sizes: "(min-width: 1024px) 340px, 60vw",
  },
  square: {
    src: "/img/adarsh-square.webp",
    width: 640,
    height: 640,
    sizes: "(min-width: 1024px) 320px, 50vw",
  },
};

export default function Portrait({ variant, priority, className }: Props) {
  const { src, width, height, sizes } = sources[variant];
  return (
    <div className={`portrait border border-rule${className ? ` ${className}` : ""}`}>
      <Image
        src={src}
        alt="Studio portrait photograph of Adarsh Agarwala"
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full"
      />
    </div>
  );
}
