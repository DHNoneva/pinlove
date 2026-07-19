import product10 from "@/assets/product10.png.asset.json";
import product11 from "@/assets/product11.png.asset.json";
import product12 from "@/assets/product12.png.asset.json";
import product13 from "@/assets/product13.png.asset.json";
import product14 from "@/assets/product14.png.asset.json";
import product15 from "@/assets/product15.png.asset.json";
import product16 from "@/assets/product16.png.asset.json";

export type Product = {
  slug: string;
  nameEn: string;
  nameBg: string;
  categoryEn: string;
  categoryBg: string;
  price: string;
  materialsEn: string;
  materialsBg: string;
  alt: string;
  image: string;
};

export const products: Product[] = [
  {
    slug: "confetti-pearl-strand",
    nameEn: "Confetti Pearl Strand",
    nameBg: "Перлена нишка Confetti",
    categoryEn: "Necklaces",
    categoryBg: "Колиета",
    price: "72 €",
    materialsEn: "Freshwater pearls, glass seed beads, gold-tone clasp",
    materialsBg: "Сладководни перли, стъклени мъниста, позлатено закопчаване",
    alt: "Handcrafted pearl necklace with colorful accents on a ceramic tray",
    image: product10.url,
  },
  {
    slug: "ivory-clover",
    nameEn: "Ivory Clover",
    nameBg: "Ivory Clover",
    categoryEn: "Necklaces",
    categoryBg: "Колиета",
    price: "84 €",
    materialsEn: "Freshwater pearls, mother-of-pearl clover, blue glass accents",
    materialsBg: "Сладководни перли, седефено цвете, сини стъклени акценти",
    alt: "Elegant pearl necklace with clover detail styled on a sculptural ceramic plate",
    image: product11.url,
  },
  {
    slug: "lilac-morning",
    nameEn: "Lilac Morning",
    nameBg: "Lilac Morning",
    categoryEn: "Necklaces",
    categoryBg: "Колиета",
    price: "78 €",
    materialsEn: "Czech beads, pearls, faceted crystal, gold-tone spacers",
    materialsBg: "Чешки мъниста, перли, фасетиран кристал, златисти елементи",
    alt: "Delicate lilac beaded necklace with pearls and clear crystals",
    image: product12.url,
  },
  {
    slug: "sea-glass-pearl",
    nameEn: "Sea Glass Pearl",
    nameBg: "Sea Glass Pearl",
    categoryEn: "Necklaces",
    categoryBg: "Колиета",
    price: "76 €",
    materialsEn: "Turquoise beads, pearls, gold-tone cube details",
    materialsBg: "Тюркоазени мъниста, перли, златисти кубчета",
    alt: "Minimal turquoise necklace with pearl centerpiece and gold details",
    image: product13.url,
  },
  {
    slug: "moonlit-balance",
    nameEn: "Moonlit Balance",
    nameBg: "Moonlit Balance",
    categoryEn: "Necklaces",
    categoryBg: "Колиета",
    price: "82 €",
    materialsEn: "Opalite beads, freshwater pearl, hematite and crystal accents",
    materialsBg: "Опалит, сладководна перла, хематит и кристални акценти",
    alt: "Contemporary handcrafted necklace with pearl, blue stones and metallic details",
    image: product14.url,
  },
  {
    slug: "champagne-loop",
    nameEn: "Champagne Loop",
    nameBg: "Champagne Loop",
    categoryEn: "Bracelets",
    categoryBg: "Гривни",
    price: "64 €",
    materialsEn: "Faceted glass beads, freshwater pearl, gold-tone clasp",
    materialsBg: "Фасетирани стъклени мъниста, сладководна перла, златисто закопчаване",
    alt: "Double-wrap champagne bracelet with single freshwater pearl detail",
    image: product15.url,
  },
  {
    slug: "starlight-thread",
    nameEn: "Starlight Thread",
    nameBg: "Starlight Thread",
    categoryEn: "Necklaces",
    categoryBg: "Колиета",
    price: "58 €",
    materialsEn: "White seed beads, mother-of-pearl star, gold-tone accents",
    materialsBg: "Бели ситни мъниста, седефена звезда, златисти акценти",
    alt: "Minimal white beaded necklace with a mother-of-pearl star charm",
    image: product16.url,
  },
];

export const featuredSlugs = ["sea-glass-pearl", "ivory-clover", "starlight-thread"];
export const bestSellerSlugs = [
  "ivory-clover",
  "confetti-pearl-strand",
  "moonlit-balance",
  "champagne-loop",
];

export const processSteps = [
  {
    titleEn: "Selected materials",
    titleBg: "Подбрани материали",
    bodyEn: "Each piece starts with pearls, stones and findings chosen for tone, balance and durability.",
    bodyBg: "Всяко бижу започва с перли, камъни и елементи, подбрани за тон, баланс и издръжливост.",
  },
  {
    titleEn: "Composed by hand",
    titleBg: "Сглобено на ръка",
    bodyEn: "Shapes are arranged bead by bead to keep every necklace soft, light and naturally elegant.",
    bodyBg: "Формите се подреждат мънисто по мънисто, за да остане всяко колие леко, меко и естествено елегантно.",
  },
  {
    titleEn: "Finished in small batches",
    titleBg: "Завършено в малки серии",
    bodyEn: "Collections are released in limited quantities so every object keeps its sense of intimacy.",
    bodyBg: "Колекциите се пускат в ограничени количества, за да запази всяко бижу усещането си за близост и специалност.",
  },
];

export const testimonials = [
  {
    quoteEn: "Every detail feels thoughtful. It looks delicate, but it carries the quiet confidence of a piece made to stay with you.",
    quoteBg: "Всеки детайл е премислен. Изглежда деликатно, но носи тиха увереност, сякаш е създадено да остане с теб.",
    author: "Elena, Sofia",
  },
  {
    quoteEn: "The packaging, the finish, the colors — everything feels refined and deeply personal.",
    quoteBg: "Опаковката, завършекът, цветовете — всичко е изискано и много лично.",
    author: "Mira, Plovdiv",
  },
  {
    quoteEn: "pinlove.studio makes handcrafted jewelry feel modern, calm and collectible rather than ornamental.",
    quoteBg: "pinlove.studio прави ръчното бижу модерно, спокойно и колекционерско, а не просто декоративно.",
    author: "Daria, Varna",
  },
];
