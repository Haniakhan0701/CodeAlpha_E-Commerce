/**
 * Kraftly — mock seller data for the Seller Dashboard.
 * TODO: replace with real data scoped to the logged-in seller once the
 * backend exists — GET /api/seller/listings, /api/seller/orders,
 * /api/seller/stats, all filtered by the authenticated user's shop.
 */

export const SELLER_SHOP_NAME = "Willow & Wren";

export const INITIAL_LISTINGS = [
  {
    id: "l1",
    title: "Hand-Stamped Copper Name Necklace",
    price: 28.5,
    category: "Jewelry",
    status: "Active",
    views: 1240,
    favorites: 89,
    orders: 34,
    image: "https://picsum.photos/seed/necklace1/300/300",
  },
  {
    id: "l2",
    title: "Sterling Silver Stacking Rings (Set of 3)",
    price: 45,
    category: "Jewelry",
    status: "Active",
    views: 860,
    favorites: 52,
    orders: 21,
    image: "https://picsum.photos/seed/rings1/300/300",
  },
  {
    id: "l3",
    title: "Botanical Pressed-Flower Drop Earrings",
    price: 21,
    category: "Jewelry",
    status: "Draft",
    views: 0,
    favorites: 0,
    orders: 0,
    image: "https://picsum.photos/seed/earrings1/300/300",
  },
];

export const INITIAL_ORDERS = [
  { id: "o1", buyer: "Meera S.", item: "Hand-Stamped Copper Name Necklace", date: "2026-07-02", status: "Processing", total: 28.5 },
  { id: "o2", buyer: "Jonas K.", item: "Sterling Silver Stacking Rings (Set of 3)", date: "2026-07-01", status: "Shipped", total: 45 },
  { id: "o3", buyer: "Aisha R.", item: "Hand-Stamped Copper Name Necklace", date: "2026-06-29", status: "Delivered", total: 28.5 },
  { id: "o4", buyer: "Tom H.", item: "Sterling Silver Stacking Rings (Set of 3)", date: "2026-06-27", status: "Delivered", total: 45 },
];

export const CATEGORIES = [
  "Jewelry", "Home Decor", "Clothing", "Art & Prints", "Electronics", "Craft Supplies", "Toys & Games",
];
