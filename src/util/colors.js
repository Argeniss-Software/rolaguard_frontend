
const ColorUtil = {
  getByIndex: (i) => {
    const colors = ['#38b9dc', '#1f77b4', '#103350', '#9467bd', '#2185d0'];
    const index = i < colors.length ? i : i%colors.length ;

    return colors[index];
  }
}

export default ColorUtil;