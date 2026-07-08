/**
 * Kraftly — mock product data.
 * Images use Picsum's seeded photo service (https://picsum.photos) instead
 * of hand-picked Unsplash IDs — some of those IDs in the first draft were
 * guessed and didn't correspond to real photos, which is why one product
 * showed a broken image. Seeded Picsum URLs always resolve to a real photo
 * and stay consistent per seed, so nothing breaks. Swap these for your own
 * product photography (or a real image upload pipeline) once you build
 * the backend.
 * TODO: replace this whole file with a real fetch to GET /api/products.
 */

function img(seed, n = 600) {
  return `https://picsum.photos/seed/${seed}/${n}/${n}`;
}

export const CATEGORIES = [
  "All",
  "Digital Products",
  "Ebooks",
  "Jewelry",
  "Home Decor",
  "Clothing",
  "Art & Prints",
  "Electronics",
  "Craft Supplies",
  "Toys & Games",
];

export const SHOP_INFO = {
  "Willow & Wren": { bio: "Hand-stamped jewelry made in a small studio in Portland. Every piece is hammered, not cast.", banner: img("willowwren-banner", 1200) },
  "Studio Marlowe": { bio: "Wheel-thrown ceramics and home goods, fired in small batches in a converted garage studio.", banner: img("marlowe-banner", 1200) },
  "Fern & Field": { bio: "Naturally dyed linen and wool clothing, made slowly and meant to last.", banner: img("fernfield-banner", 1200) },
  "Paper Meadow": { bio: "Original watercolor art, giclée printed on archival paper.", banner: img("papermeadow-banner", 1200) },
  "Grainwood Co.": { bio: "Small-batch woodworking — phone stands, trays, and desk accessories carved from reclaimed hardwood.", banner: img("grainwood-banner", 1200) },
  "Thread & Thistle": { bio: "Embroidery kits and craft supplies for beginners and hobbyists alike.", banner: img("threadthistle-banner", 1200) },
  "Little Acorn Toys": { bio: "Wool felt toys, hand-sewn and safe for little hands.", banner: img("acorn-banner", 1200) },
  "Saddle & Stitch": { bio: "Full-grain leather goods, hand-stitched with waxed thread.", banner: img("saddlestitch-banner", 1200) },
  "Amber & Oak": { bio: "Hand-poured soy candles in reusable glass jars, scented in small batches.", banner: img("amberoak-banner", 1200) },
  "Northline Audio": { bio: "Compact, handmade wooden speaker docks and audio accessories.", banner: img("northline-banner", 1200) },
  "Loop & Lantern": { bio: "Macrame, woven wall art, and fiber pieces made on a wooden loom.", banner: img("looplantern-banner", 1200) },
  "Moss & Copper": { bio: "Botanical-inspired jewelry cast from real pressed leaves and flowers.", banner: img("mosscopper-banner", 1200) },
};

export const PRODUCTS = [
  {
    id: "pr1", title: "Hand-Stamped Copper Name Necklace", category: "Jewelry", shop: "Willow & Wren",
    price: 28.5, rating: 4.8, reviewCount: 342,
    images: [img("necklace1"), img("necklace1b"), img("necklace1c")],
    variants: { Metal: ["Copper", "Silver", "Gold-filled"], Length: ["16\"", "18\"", "20\""] },
    description: "A delicate hand-stamped necklace, personalized with the name of your choice. Each piece is hammered and finished by hand — no two are exactly alike.",
  },
  {
    id: "pr2", title: "Ceramic Table Lamp, Speckled Glaze", category: "Home Decor", shop: "Studio Marlowe",
    price: 96, rating: 4.9, reviewCount: 128,
    images: [img("lamp1"), img("lamp1b")],
    variants: { Glaze: ["Speckled Cream", "Sage Green", "Charcoal"] },
    description: "Wheel-thrown ceramic base with a warm linen shade. Each lamp is fired individually, so the glaze pattern is unique to your piece.",
  },
  {
    id: "pr3", title: "Linen Wrap Dress, Hand-Dyed", category: "Clothing", shop: "Fern & Field",
    price: 74, rating: 4.6, reviewCount: 89,
    images: [img("dress1"), img("dress1b")],
    variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Terracotta", "Sage", "Natural"] },
    description: "100% linen wrap dress, hand-dyed in small batches using natural pigments. Relaxed fit, tie waist, deep pockets.",
  },
  {
    id: "pr4", title: "Watercolor Botanical Print Set (3)", category: "Art & Prints", shop: "Paper Meadow",
    price: 32, rating: 4.9, reviewCount: 501,
    images: [img("prints1"), img("prints1b")],
    variants: { Size: ["8x10\"", "11x14\"", "A3"] },
    description: "A set of three original watercolor botanical prints, giclée printed on archival matte paper. Frame not included.",
  },
  {
    id: "pr5", title: "Handmade Walnut Wood Phone Stand", category: "Electronics", shop: "Grainwood Co.",
    price: 22, rating: 4.7, reviewCount: 214,
    images: [img("phonestand1"), img("phonestand1b")],
    variants: { Wood: ["Walnut", "Maple", "Oak"] },
    description: "A minimalist phone stand carved from solid walnut, sanded and finished with food-safe oil. Fits most phones with or without a case.",
  },
  {
    id: "pr6", title: "Beginner Embroidery Kit", category: "Craft Supplies", shop: "Thread & Thistle",
    price: 24, rating: 4.8, reviewCount: 176,
    images: [img("embroidery1"), img("embroidery1b")],
    variants: { Kit: ["Wildflower", "Ocean", "Forest"] },
    description: "Everything you need to start embroidering: pre-printed fabric, hoop, needles, floss in 12 colors, and an illustrated instruction booklet.",
  },
  {
    id: "pr7", title: "Felt Wool Play Food Set", category: "Toys & Games", shop: "Little Acorn Toys",
    price: 38, rating: 4.9, reviewCount: 267,
    images: [img("playfood1"), img("playfood1b")],
    variants: { Set: ["Breakfast", "Fruit & Veg", "Bakery"] },
    description: "Hand-sewn felt play food made from 100% wool felt. Safe, durable, and machine washable — a favorite for imaginative play.",
  },
  {
    id: "pr8", title: "Sterling Silver Stacking Rings (Set of 3)", category: "Jewelry", shop: "Willow & Wren",
    price: 45, rating: 4.7, reviewCount: 198,
    images: [img("rings1"), img("rings1b")],
    variants: { Size: ["5", "6", "7", "8", "9"] },
    description: "A set of three thin stacking rings in sterling silver — wear together or separately. Hand-forged and hallmarked.",
  },
  {
    id: "pr9", title: "Macrame Wall Hanging, Large", category: "Home Decor", shop: "Loop & Lantern",
    price: 58, rating: 4.8, reviewCount: 143,
    images: [img("macrame1"), img("macrame1b")],
    variants: { Size: ["24\"", "36\"", "48\""] },
    description: "Hand-knotted macrame wall hanging using natural cotton cord. Made on a wooden dowel and ready to hang.",
  },
  {
    id: "pr10", title: "Leather Passport Holder, Embossed", category: "Craft Supplies", shop: "Saddle & Stitch",
    price: 34, rating: 4.9, reviewCount: 312,
    images: [img("passport1"), img("passport1b")],
    variants: { Leather: ["Cognac", "Black", "Forest Green"], Embossing: ["None", "Initials"] },
    description: "Full-grain leather passport holder, hand-stitched with waxed thread. Ages beautifully with use.",
  },
  {
    id: "pr11", title: "Hand-Poured Soy Candle, Cedar & Sage", category: "Home Decor", shop: "Amber & Oak",
    price: 19, rating: 4.6, reviewCount: 402,
    images: [img("candle1"), img("candle1b")],
    variants: { Size: ["8oz", "12oz"] },
    description: "A hand-poured soy wax candle scented with cedarwood and sage, in a reusable amber glass jar. 45+ hour burn time.",
  },
  {
    id: "pr12", title: "Hand-Knit Chunky Wool Beanie", category: "Clothing", shop: "Fern & Field",
    price: 26, rating: 4.8, reviewCount: 231,
    images: [img("beanie1"), img("beanie1b")],
    variants: { Color: ["Oat", "Charcoal", "Rust"] },
    description: "A chunky hand-knit beanie made from soft merino wool. One size, relaxed fit.",
  },
  {
    id: "pr13", title: "Botanical Pressed-Flower Drop Earrings", category: "Jewelry", shop: "Moss & Copper",
    price: 21, rating: 4.7, reviewCount: 156,
    images: [img("earrings1"), img("earrings1b")],
    variants: { Flower: ["Fern", "Baby's Breath", "Lavender"] },
    description: "Real pressed flowers set in resin, finished with hypoallergenic gold-plated hooks.",
  },
  {
    id: "pr14", title: "Handwoven Cotton Throw Blanket", category: "Home Decor", shop: "Loop & Lantern",
    price: 64, rating: 4.9, reviewCount: 187,
    images: [img("throw1"), img("throw1b")],
    variants: { Color: ["Clay", "Cream", "Indigo"] },
    description: "Handwoven on a floor loom using 100% cotton yarn. Soft, breathable, and made to be used daily.",
  },
  {
    id: "pr15", title: "Hand-Carved Wooden Desk Organizer", category: "Electronics", shop: "Grainwood Co.",
    price: 42, rating: 4.6, reviewCount: 94,
    images: [img("organizer1"), img("organizer1b")],
    variants: { Wood: ["Walnut", "Oak"] },
    description: "A desk organizer with slots for pens, cards, and a phone stand cutout — hand-carved from a single block of hardwood.",
  },
  {
    id: "pr16", title: "Wooden Bluetooth Speaker Dock", category: "Electronics", shop: "Northline Audio",
    price: 68, rating: 4.7, reviewCount: 121,
    images: [img("speaker1"), img("speaker1b")],
    variants: { Wood: ["Walnut", "Bamboo"] },
    description: "A handmade wooden dock housing a compact Bluetooth speaker — warm sound, minimalist design, no cables in sight.",
  },
  {
    id: "pr17", title: "Linen Button-Up Shirt, Relaxed Fit", category: "Clothing", shop: "Fern & Field",
    price: 58, rating: 4.5, reviewCount: 76,
    images: [img("shirt1"), img("shirt1b")],
    variants: { Size: ["S", "M", "L", "XL"], Color: ["Stone", "Olive", "White"] },
    description: "A breathable linen button-up with a relaxed, unstructured fit. Garment-dyed for a soft, lived-in feel from day one.",
  },
  {
    id: "pr18", title: "Ink Wash Mountain Print", category: "Art & Prints", shop: "Paper Meadow",
    price: 28, rating: 4.8, reviewCount: 203,
    images: [img("inkwash1"), img("inkwash1b")],
    variants: { Size: ["8x10\"", "11x14\""] },
    description: "A minimalist ink wash landscape, printed on heavyweight cotton rag paper. Ships rolled in a protective tube.",
  },
  {
    id: "pr19", title: "Wooden Building Block Set (50 pcs)", category: "Toys & Games", shop: "Little Acorn Toys",
    price: 46, rating: 4.9, reviewCount: 289,
    images: [img("blocks1"), img("blocks1b")],
    variants: { Finish: ["Natural", "Painted Pastel"] },
    description: "50 solid maple building blocks, sanded smooth and finished with non-toxic, food-safe oil. A classic that lasts generations.",
  },
  {
    id: "pr20", title: "Hand-Bound Leather Journal", category: "Craft Supplies", shop: "Saddle & Stitch",
    price: 30, rating: 4.8, reviewCount: 267,
    images: [img("journal1"), img("journal1b")],
    variants: { Paper: ["Blank", "Lined", "Dotted"] },
    description: "A hand-bound journal with a full-grain leather cover that develops a rich patina over time. 200 pages of thick, ink-friendly paper.",
  },
  {
    id: "pr21", title: "Copper Wire-Wrapped Gemstone Pendant", category: "Jewelry", shop: "Moss & Copper",
    price: 24, rating: 4.6, reviewCount: 118,
    images: [img("pendant1"), img("pendant1b")],
    variants: { Stone: ["Amethyst", "Rose Quartz", "Moonstone"] },
    description: "A raw gemstone hand-wrapped in copper wire, one of a kind by nature — no two pendants are exactly alike.",
  },
  {
    id: "pr22", title: "Stoneware Dinner Bowl Set (4)", category: "Home Decor", shop: "Studio Marlowe",
    price: 72, rating: 4.9, reviewCount: 154,
    images: [img("bowls1"), img("bowls1b")],
    variants: { Glaze: ["Speckled Cream", "Sage Green"] },
    description: "A set of four wheel-thrown stoneware bowls, dishwasher and microwave safe, each with slight natural variation in glaze.",
  },
  {
    id: "pr23", title: "Wool Felt Finger Puppet Set", category: "Toys & Games", shop: "Little Acorn Toys",
    price: 20, rating: 4.7, reviewCount: 143,
    images: [img("puppets1"), img("puppets1b")],
    variants: { Set: ["Forest Animals", "Farm Animals"] },
    description: "Six hand-sewn wool felt finger puppets, perfect for imaginative play and storytelling.",
  },
  {
    id: "pr24", title: "Minimalist Wall Clock, Walnut", category: "Home Decor", shop: "Grainwood Co.",
    price: 54, rating: 4.7, reviewCount: 98,
    images: [img("clock1"), img("clock1b")],
    variants: { Wood: ["Walnut", "Oak"] },
    description: "A silent-movement wall clock with a solid walnut face and brass hands. No ticking, just quiet timekeeping.",
  },
  {
    id: "pr25", title: "Watercolor Texture Brush Pack (Procreate)", category: "Digital Products", shop: "Paper Meadow",
    price: 12, rating: 4.8, reviewCount: 156,
    images: [img("brushpack1"), img("brushpack1b")],
    variants: { License: ["Personal", "Commercial"] },
    description: "A set of 40 hand-painted watercolor brushes for Procreate, scanned from real paint textures. Instant digital download, no physical item shipped.",
  },
  {
    id: "pr26", title: "Printable Budget Planner (PDF)", category: "Digital Products", shop: "Paper Meadow",
    price: 8, rating: 4.7, reviewCount: 203,
    images: [img("plannerpdf1"), img("plannerpdf1b")],
    variants: { Format: ["Letter", "A4"] },
    description: "A 12-month printable budget planner, delivered as an instant-download PDF. Print at home or at a copy shop.",
  },
  {
    id: "pr27", title: "eBook: A Slow Maker's Year", category: "Ebooks", shop: "Fern & Field",
    price: 14, rating: 4.9, reviewCount: 88,
    images: [img("ebook1"), img("ebook1b")],
    variants: { Format: ["EPUB", "PDF"] },
    description: "A 220-page seasonal guide to slow, handmade living — natural dyeing, mending, and working with linen and wool through the year.",
  },
  {
    id: "pr28", title: "eBook: The Independent Shop Owner's Guide", category: "Ebooks", shop: "Saddle & Stitch",
    price: 16, rating: 4.8, reviewCount: 134,
    images: [img("ebook2"), img("ebook2b")],
    variants: { Format: ["EPUB", "PDF"] },
    description: "A practical guide to pricing, photographing, and shipping handmade goods — written by a full-time independent maker.",
  },
];

export const REVIEWS = {
  pr1: [
    { id: "r1", author: "Meera S.", rating: 5, text: "Beautiful quality and arrived faster than expected. The stamping is so clean." },
    { id: "r2", author: "Jonas K.", rating: 5, text: "Bought this for my partner's birthday, she hasn't taken it off since." },
    { id: "r3", author: "Aisha R.", rating: 4, text: "Lovely necklace, chain is slightly shorter than I expected but still gorgeous." },
  ],
  pr2: [
    { id: "r4", author: "Tom H.", rating: 5, text: "The glaze pattern on mine is stunning, exactly like the photos." },
    { id: "r5", author: "Lucia M.", rating: 5, text: "Perfect warm light for my reading corner. Well packaged too." },
  ],
  pr11: [
    { id: "r6", author: "Priya D.", rating: 5, text: "Smells amazing without being overpowering, and the jar is genuinely reusable." },
    { id: "r7", author: "Sam W.", rating: 4, text: "Burns evenly, no tunneling. Would buy the 12oz next time." },
  ],
};
