const ColorUtil = {
  colorList: () => { return [
      "#7138DC",
      "#5F6B73",
      "#103350",
      "#9467bd",
      "#16A984",
      "#bd00bd",
      "#ff85c2",
      "#6666ff",
      "#009999",
      "#808080",
      "#c0955d",
      "#999900",
      "#00bdbd",
      "#000066",
      "#FE9A76",
      "#6b00bd",
      "#ff33ff",
      "#d600d6",
      "#000080",
      "#ff52a8",
    ];
  },
  getByIndex: (i) => {
    const colors = ColorUtil.colorList()
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
