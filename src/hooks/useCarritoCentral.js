import { useState, useEffect } from "react";

const KEY = "north_pedido_central";

export default function useCarritoCentral() {
  const [items, setItems] = useState(() => {
    try {
      const s = localStorage.getItem(KEY);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const itemId = (modelo, gusto) => `${modelo}||${gusto}`;

  const agregar = (modelo, gusto, precio = null, gusto_id = null) => {
    setItems((prev) => {
      const id = itemId(modelo, gusto);
      const existe = prev.find((i) => i.id === id);
      if (existe) return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, modelo, gusto, precio, gusto_id, qty: 1 }];
    });
  };

  const cambiar = (id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const quitar  = (id)          => setItems((prev) => prev.filter((i) => i.id !== id));
  const vaciar  = ()             => setItems([]);

  const cantidadDe = (modelo, gusto) =>
    items.find((i) => i.id === itemId(modelo, gusto))?.qty ?? 0;

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPesos = items.reduce((s, i) => s + (i.precio ?? 0) * i.qty, 0);

  return { items, agregar, cambiar, quitar, vaciar, cantidadDe, totalItems, totalPesos };
}
