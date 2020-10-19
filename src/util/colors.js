const ColorUtil = {
  getByIndex: (i) => {
    const colors = [
      "#5d9cec",
      "#fad732",
      "#ff902b",
      "#f05050",
      "#B03060",
      "#FE9A76",
      "#FFD700",
      "#32CD32",
      "#016936",
      "#008080",
      "#0E6EB8",
      "#EE82EE",
      "#B413EC",
      "#FF1493",
      "#A52A2A",
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
