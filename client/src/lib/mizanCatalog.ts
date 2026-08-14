export type Lang = "en" | "ar";

export type Bilingual = { en: string; ar: string };

export type CoffeeProduct = {
  id: string;
  name: Bilingual;
  shortName: Bilingual;
  image: string;
  ogImage: string;
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
  batch: BatchRecord;
};

export type BatchRecord = {
  recordId: string;
  lotLabel: Bilingual;
  verification: Bilingual;
  sourceType: Bilingual;
  evidence: Bilingual;
  reviewedAt: Bilingual;
};

export type BrewArticle = {
  id: string;
  productId: string;
  method: Bilingual;
  title: Bilingual;
  summary: Bilingual;
  ratio: string;
  temperature: string;
  grind: Bilingual;
  time: string;
  steps: Bilingual[];
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
    ogImage: "/manus-storage/caffio-alto-og_3ea1405c.jpg",
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
    batch: { recordId: "MZN-ALTO-01", lotLabel: { en: "Seasonal lot / draft", ar: "محصول موسمي / مسودة" }, verification: { en: "Needs source review", ar: "يحتاج مراجعة المصدر" }, sourceType: { en: "Batch card or producer document", ar: "بطاقة دفعة أو مستند المنتج" }, evidence: { en: "No supporting file attached", ar: "لم يُرفق مستند داعم" }, reviewedAt: { en: "Not reviewed", ar: "لم تتم المراجعة" } },
  },
  {
    id: "sombra",
    name: { en: "SOMBRA / Seasonal Lot", ar: "SOMBRA / المحصول الموسمي" },
    shortName: { en: "SOMBRA", ar: "SOMBRA" },
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=88",
    ogImage: "/manus-storage/caffio-sombra-og_3c75d4cf.jpg",
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
    batch: { recordId: "MZN-SOMBRA-01", lotLabel: { en: "Seasonal lot / draft", ar: "محصول موسمي / مسودة" }, verification: { en: "Needs source review", ar: "يحتاج مراجعة المصدر" }, sourceType: { en: "Batch card or producer document", ar: "بطاقة دفعة أو مستند المنتج" }, evidence: { en: "No supporting file attached", ar: "لم يُرفق مستند داعم" }, reviewedAt: { en: "Not reviewed", ar: "لم تتم المراجعة" } },
  },
  {
    id: "mizan-house",
    name: { en: "CAFFIO / House Espresso", ar: "كافيو / إسبريسو البيت" },
    shortName: { en: "HOUSE ESPRESSO", ar: "إسبريسو البيت" },
    image: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=88",
    ogImage: "/manus-storage/caffio-house-espresso-og_e3da63b0.jpg",
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
    batch: { recordId: "MZN-HOUSE-01", lotLabel: { en: "House espresso / draft", ar: "إسبريسو البيت / مسودة" }, verification: { en: "Needs source review", ar: "يحتاج مراجعة المصدر" }, sourceType: { en: "Blend card or producer document", ar: "بطاقة خلطة أو مستند المنتج" }, evidence: { en: "No supporting file attached", ar: "لم يُرفق مستند داعم" }, reviewedAt: { en: "Not reviewed", ar: "لم تتم المراجعة" } },
  },
];

export const getCoffeeProduct = (id: string) => coffeeProducts.find((product) => product.id === id) ?? coffeeProducts[0];

export const formatPrice = (price: number, lang: Lang) => lang === "ar" ? `${price} $` : `US$${price}`;

export const fieldNotes: BrewArticle[] = [
  {
    id: "alto-pourover", productId: "alto", method: { en: "Pour-over", ar: "ترشيح" }, title: { en: "A clear, patient pour-over", ar: "ترشيح واضح وهادئ" }, summary: { en: "A repeatable starting point for opening a light profile without turning the cup into a formula.", ar: "نقطة بداية قابلة للتكرار لفتح الملف الخفيف دون تحويل الكوب إلى معادلة جامدة." }, ratio: "1:16", temperature: "92°C", grind: { en: "Medium-fine", ar: "متوسط ناعم" }, time: "03:30–04:00", steps: [{ en: "Rinse the paper and warm the brewer.", ar: "اغسل الورق وسخّن أداة التحضير." }, { en: "Bloom with twice the coffee weight for 40 seconds.", ar: "بلّل القهوة بضعف وزنها واتركها 40 ثانية." }, { en: "Pour in two slow circles, then let the bed settle.", ar: "اسكب بدورتين هادئتين ثم اترك قاع القهوة يستقر." }] },
  {
    id: "alto-aeropress", productId: "alto", method: { en: "AeroPress", ar: "إيروبرس" }, title: { en: "A soft AeroPress start", ar: "بداية ناعمة بالإيروبرس" }, summary: { en: "A compact recipe with enough body for a slower morning and room to adjust the final press.", ar: "وصفة مركزة تمنح الصباح قوامًا كافيًا مع مساحة لتعديل الضغطة الأخيرة." }, ratio: "1:14", temperature: "90°C", grind: { en: "Medium", ar: "متوسط" }, time: "02:00", steps: [{ en: "Add coffee and water, then stir twice.", ar: "أضف القهوة والماء ثم حرّك مرتين." }, { en: "Steep for 75 seconds without forcing the bed.", ar: "اتركها 75 ثانية دون ضغط قاع القهوة." }, { en: "Press slowly and dilute only if the cup asks for it.", ar: "اضغط ببطء وخفف فقط إذا احتاج الكوب." }] },
  {
    id: "sombra-pourover", productId: "sombra", method: { en: "Pour-over", ar: "ترشيح" }, title: { en: "A balanced afternoon pour", ar: "ترشيح متوازن للظهيرة" }, summary: { en: "A calm baseline designed to keep sweetness and structure in conversation.", ar: "خط أساس هادئ يحافظ على توازن الحلاوة والبنية في الكوب." }, ratio: "1:15", temperature: "93°C", grind: { en: "Medium", ar: "متوسط" }, time: "03:00–03:40", steps: [{ en: "Use an even bed and a gentle first pour.", ar: "ابدأ بطبقة متساوية وسكب أول هادئ." }, { en: "Keep the water level stable through the middle pour.", ar: "حافظ على مستوى الماء خلال السكب الأوسط." }, { en: "Taste warm, then taste again as the cup cools.", ar: "تذوقها دافئة ثم أعد التذوق مع انخفاض الحرارة." }] },
  {
    id: "sombra-frenchpress", productId: "sombra", method: { en: "French press", ar: "فرنش برس" }, title: { en: "A slower French press", ar: "فرنش برس على مهل" }, summary: { en: "A fuller route for days when texture matters as much as clarity.", ar: "مسار بقوام أوسع للأيام التي يهم فيها الملمس بقدر الوضوح." }, ratio: "1:15", temperature: "94°C", grind: { en: "Coarse", ar: "خشن" }, time: "04:00", steps: [{ en: "Pour all the water and break the crust at 60 seconds.", ar: "اسكب الماء كاملًا وافتح القشرة بعد 60 ثانية." }, { en: "Let the brew rest until the surface quiets.", ar: "اترك التحضير حتى يهدأ السطح." }, { en: "Press gently and pour immediately.", ar: "اضغط بلطف واسكب فورًا." }] },
  {
    id: "mizan-espresso", productId: "mizan-house", method: { en: "Espresso", ar: "إسبريسو" }, title: { en: "A measured espresso start", ar: "بداية إسبريسو محسوبة" }, summary: { en: "A starting ratio for dialing in, not a promise of one fixed recipe.", ar: "نسبة بداية للمعايرة، وليست وعدًا بوصفة واحدة ثابتة." }, ratio: "1:2", temperature: "93°C", grind: { en: "Fine", ar: "ناعم" }, time: "00:25–00:30", steps: [{ en: "Distribute evenly and tamp level.", ar: "وزع القهوة بالتساوي واضغط بشكل مستوٍ." }, { en: "Watch time and yield before changing dose.", ar: "راقب الوقت والمخرج قبل تغيير الجرعة." }, { en: "Adjust grind one small step at a time.", ar: "عدّل الطحن خطوة صغيرة في كل مرة." }] },
  {
    id: "mizan-moka", productId: "mizan-house", method: { en: "Moka pot", ar: "موكا بوت" }, title: { en: "A steady moka pot", ar: "موكا بوت ثابتة" }, summary: { en: "Keep the heat low and the last pour deliberate for a rounded, practical cup.", ar: "اجعل الحرارة منخفضة والسكب الأخير محسوبًا لكوب عملي ومتوازن." }, ratio: "1:7", temperature: "Low heat", grind: { en: "Medium-fine", ar: "متوسط ناعم" }, time: "04:00–05:00", steps: [{ en: "Fill below the valve with hot water.", ar: "املأ الماء الساخن أسفل الصمام." }, { en: "Keep the heat low and remove before sputtering.", ar: "أبقِ الحرارة منخفضة وارفعها قبل التقطيع." }, { en: "Cool the base briefly, then serve.", ar: "برّد القاعدة قليلًا ثم قدّم القهوة." }] },
];
