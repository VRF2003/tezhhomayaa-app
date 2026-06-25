export type SubItem = { label: string; href: string };
export type Category = { label: string; href: string; items?: SubItem[] };
export type MainNavEntry = {
  label: string;
  href?: string;
  expandable?: boolean;
  categories?: Category[];
};

export const defaultMainNav: MainNavEntry[] = [
  { label: "New In", href: "/women/new-in" },
  {
    label: "Women",
    expandable: true,
    categories: [
      { label: "New In", href: "/women/new-in" },
      {
        label: "Bags",
        href: "/women/bags",
        items: [
          { label: "Tote Bags",    href: "/women/bags" },
          { label: "Shoulder Bags", href: "/women/bags" },
          { label: "Mini Bags",     href: "/women/bags" },
        ],
      },
      {
        label: "Ready To Wear",
        href: "/women/ready-to-wear",
        items: [
          { label: "Tops & Shirts",        href: "/women/ready-to-wear/tops-shirts" },
          { label: "Dresses & Jumpsuits",  href: "/women/ready-to-wear/dresses-jumpsuits" },
          { label: "Pants & Shorts",       href: "/women/ready-to-wear/pants-shorts" },
          { label: "Skirts",               href: "/women/ready-to-wear/skirts" },
          { label: "Sweatshirts",          href: "/women/ready-to-wear/sweatshirts" },
        ],
      },
      { label: "Accessories", href: "/women/accessories" },
    ],
  },
  {
    label: "Men",
    expandable: true,
    categories: [
      { label: "New In", href: "/men/new-in" },
      {
        label: "Bags",
        href: "/men/bags",
        items: [
          { label: "Tote Bags",   href: "/men/bags" },
          { label: "Backpacks",   href: "/men/bags" },
          { label: "Travel Bags", href: "/men/bags" },
        ],
      },
      {
        label: "Ready To Wear",
        href: "/men/ready-to-wear",
        items: [
          { label: "Shirts",                   href: "/men/ready-to-wear/shirts" },
          { label: "T-Shirts & Polos",         href: "/men/ready-to-wear/t-shirts-polos" },
          { label: "Trousers & Shorts",        href: "/men/ready-to-wear/trousers-shorts" },
          { label: "Tracksuits & Sweatshirts", href: "/men/ready-to-wear/tracksuits-sweatshirts" },
          { label: "Coats & Jackets",          href: "/men/ready-to-wear/coats-jackets" },
        ],
      },
      { label: "Accessories", href: "/men/accessories" },
    ],
  },
  {
    label: "Fragrances",
    expandable: true,
    categories: [
      { label: "Women", href: "/fragrances/women" },
      { label: "Men",   href: "/fragrances/men" },
    ],
  },
];
