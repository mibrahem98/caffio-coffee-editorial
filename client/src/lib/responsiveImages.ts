export type ResponsiveImageSet = {
  avif: Array<{ src: string; width: number }>;
  webp: Array<{ src: string; width: number }>;
  fallback: string;
  sizes: string;
};

const avif = (src: string, width: number) => ({ src, width });
const webp = (src: string, width: number) => ({ src, width });

export const responsiveImages = {
  hero: {
    avif: [avif("/manus-storage/hero-480_a8da9c2c.avif", 480), avif("/manus-storage/hero-800_ef1516a6.avif", 800), avif("/manus-storage/hero-1200_fa936759.avif", 1200), avif("/manus-storage/hero-1600_31d7f050.avif", 1600)],
    webp: [webp("/manus-storage/hero-480_b6e8c338.webp", 480), webp("/manus-storage/hero-800_b1f2fcff.webp", 800), webp("/manus-storage/hero-1200_768db0f8.webp", 1200), webp("/manus-storage/hero-1600_cc60e58a.webp", 1600)],
    fallback: "/manus-storage/hero-1200_768db0f8.webp",
    sizes: "(max-width: 850px) 86vw, (max-width: 1200px) 52vw, 680px",
  },
  ritual: {
    avif: [avif("/manus-storage/ritual-480_93e739ca.avif", 480), avif("/manus-storage/ritual-800_4276507f.avif", 800), avif("/manus-storage/ritual-1200_a08fc2c5.avif", 1200)],
    webp: [webp("/manus-storage/ritual-480_0de13bba.webp", 480), webp("/manus-storage/ritual-800_064fc522.webp", 800), webp("/manus-storage/ritual-1200_a4561155.webp", 1200)],
    fallback: "/manus-storage/ritual-800_064fc522.webp",
    sizes: "(max-width: 850px) 86vw, 42vw",
  },
  alto: {
    avif: [avif("/manus-storage/alto-480_edd8e201.avif", 480), avif("/manus-storage/alto-800_ed76560e.avif", 800), avif("/manus-storage/alto-1200_29158210.avif", 1200)],
    webp: [webp("/manus-storage/alto-480_ec5f2f2e.webp", 480), webp("/manus-storage/alto-800_eea7da9e.webp", 800), webp("/manus-storage/alto-1200_ad479738.webp", 1200)],
    fallback: "/manus-storage/alto-800_eea7da9e.webp",
    sizes: "(max-width: 850px) 86vw, (max-width: 1200px) 33vw, 360px",
  },
  sombra: {
    avif: [avif("/manus-storage/sombra-480_d565ecad.avif", 480), avif("/manus-storage/sombra-800_bddc745f.avif", 800), avif("/manus-storage/sombra-1200_d4037be4.avif", 1200)],
    webp: [webp("/manus-storage/sombra-480_748193cc.webp", 480), webp("/manus-storage/sombra-800_b78abe3a.webp", 800), webp("/manus-storage/sombra-1200_e64b4f8d.webp", 1200)],
    fallback: "/manus-storage/sombra-800_b78abe3a.webp",
    sizes: "(max-width: 850px) 86vw, (max-width: 1200px) 33vw, 360px",
  },
  house: {
    avif: [avif("/manus-storage/house-480_77941a20.avif", 480), avif("/manus-storage/house-800_48ed0d53.avif", 800), avif("/manus-storage/house-1200_69c0f376.avif", 1200)],
    webp: [webp("/manus-storage/house-480_7bb7f015.webp", 480), webp("/manus-storage/house-800_96242ff1.webp", 800), webp("/manus-storage/house-1200_86e3e58f.webp", 1200)],
    fallback: "/manus-storage/house-800_96242ff1.webp",
    sizes: "(max-width: 850px) 86vw, (max-width: 1200px) 33vw, 360px",
  },
  journal: {
    avif: [avif("/manus-storage/journal-480_5ae5dabf.avif", 480), avif("/manus-storage/journal-800_41a45f76.avif", 800)],
    webp: [webp("/manus-storage/journal-480_abb7b3a6.webp", 480), webp("/manus-storage/journal-800_4885631d.webp", 800)],
    fallback: "/manus-storage/journal-800_4885631d.webp",
    sizes: "(max-width: 850px) 86vw, 29vw",
  },
} satisfies Record<string, ResponsiveImageSet>;

export type ResponsiveImageKey = keyof typeof responsiveImages;
