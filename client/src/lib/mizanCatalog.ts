export type Lang = "en" | "ar";

export type Bilingual = { en: string; ar: string };

export type CoffeeProduct = {
  id: string;
  name: Bilingual;
  shortName: Bilingual;
  image: string;
  profile: Bilingual;
  status: Bilingual;
  weight: string;
  price: number;
  roastTone: "light" | "medium" | "espresso";
  process: Bilingual;
  origin: Bilingual;
  farm: Bilingual;
  altitude: Bilingual;
  tastingNotes: Bilingual[];
  brewMethods: Bilingual[];
  sourceLabel: Bilingual;
};

const pending: Bilingual = {
  en: "Pending batch document",
  ar: "بانتظار مستند الدفعة",
};

export const coffeeProducts: CoffeeProduct[] = [
  {
    id: "alto",
    name: { en: "ALTO / Seasonal Lot", ar: "ALTO / المحصول الموسمي" },
    shortName: { en: "ALTO", ar: "ALTO" },
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=88",
    profile: { en: "Light / awaiting cupping sheet", ar: "خفيف / بانتظار بطاقة التذوق" },
    status: { en: "Origin record in progress", ar: "سجل المنشأ قيد الإعداد" },
    weight: "250 g",
    price: 18,
    roastTone: "light",
    process: pending,
    origin: pending,
    farm: pending,
    altitude: pending,
    tastingNotes: [pending, pending, pending],
    brewMethods: [{ en: "Pour-over", ar: "ترشيح" }, { en: "AeroPress", ar: "إيروبرس" }],
    sourceLabel: { en: "Product card / source required before publishing origin claims", ar: "بطاقة المنتج / يلزم المصدر قبل نشر ادعاءات المنشأ" },
  },
  {
    id: "sombra",
    name: { en: "SOMBRA / Seasonal Lot", ar: "SOMBRA / المحصول الموسمي" },
    shortName: { en: "SOMBRA", ar: "SOMBRA" },
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=88",
    profile: { en: "Medium / awaiting cupping sheet", ar: "متوسط / بانتظار بطاقة التذوق" },
    status: { en: "Origin record in progress", ar: "سجل المنشأ قيد الإعداد" },
    weight: "250 g",
    price: 20,
    roastTone: "medium",
    process: pending,
    origin: pending,
    farm: pending,
    altitude: pending,
    tastingNotes: [pending, pending, pending],
    brewMethods: [{ en: "Pour-over", ar: "ترشيح" }, { en: "French press", ar: "فرنش برس" }],
    sourceLabel: { en: "Product card / source required before publishing origin claims", ar: "بطاقة المنتج / يلزم المصدر قبل نشر ادعاءات المنشأ" },
  },
  {
    id: "mizan-house",
    name: { en: "MIZAN / House Espresso", ar: "ميزان / إسبريسو البيت" },
    shortName: { en: "HOUSE ESPRESSO", ar: "إسبريسو البيت" },
    image: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=88",
    profile: { en: "Medium-dark / awaiting roast sheet", ar: "متوسط داكن / بانتظار بطاقة التحميص" },
    status: { en: "Blend record in progress", ar: "سجل الخلطة قيد الإعداد" },
    weight: "250 g",
    price: 16,
    roastTone: "espresso",
    process: pending,
    origin: pending,
    farm: pending,
    altitude: pending,
    tastingNotes: [pending, pending, pending],
    brewMethods: [{ en: "Espresso", ar: "إسبريسو" }, { en: "Moka pot", ar: "موكا بوت" }],
    sourceLabel: { en: "Blend card / source required before publishing origin claims", ar: "بطاقة الخلطة / يلزم المصدر قبل نشر ادعاءات المنشأ" },
  },
];

export const getCoffeeProduct = (id: string) => coffeeProducts.find((product) => product.id === id) ?? coffeeProducts[0];

export const formatPrice = (price: number, lang: Lang) => lang === "ar" ? `${price} $` : `US$${price}`;
