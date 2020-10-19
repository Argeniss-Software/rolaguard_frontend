const ColorUtil = {
  getByIndex: (i) => {
    const colors = [
      "#38b9dc",
      "#1f77b4",
      "#F46036",
      "#103350",
      "#E71D36",
      "#9467bd",
      "#2185d0",
      "#8B1E3F",
      "#CEBACF",
      "#B697D2",
      "#C5D86D",
      "#80ED99",
    ];
    const index = i < colors.length ? i : i % colors.length;

    return colors[index];
  },

  getByImportance: (i) => {
    const colorMap = {
      LOW: "#fad732",
      MEDIUM: "#ff902b",
      HIGH: "#f05050",
    };

    return colorMap[i];
  },
};

export default ColorUtil;
