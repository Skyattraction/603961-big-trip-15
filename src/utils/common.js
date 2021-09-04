export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const removeItem = (items, remove) => {
  const index = items.findIndex((item) => item.id === remove.id);

  if (index > -1) {
    items.splice(index, 1);
  }
  return items;
};
