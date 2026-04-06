const BRAND_MAP = [
  { test: /^elfbar/i, brand: "Elfbar" },
  { test: /^lost\s*mary|^lm\b/i, brand: "Lost Mary" },
  { test: /^ignite/i, brand: "Ignite" },
  { test: /^maskking/i, brand: "Maskking" },
];
export function getBrand(modelo = "") {
  const hit = BRAND_MAP.find((b) => b.test.test(modelo));
  return hit ? hit.brand : "Otros";
}
