import * as d3 from 'd3';

class CirclePackD3 {

  constructor(containerEl, props) {
    
    this.containerEl = containerEl;
    this.props = props;

    const pack = data => d3.pack()
    .size([props.width, props.height])
    .padding(3)
    (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

    const root = pack({name: root, children: props.data.filter((item) => !item.selected)});

    this.svg = d3.select(containerEl)
    .append("svg")
      .attr("width", props.width)
      .attr("height", props.height)
      .style("display", "block")
      .style("background", "white")
      .style("cursor", "default")

    this.mainGroup = this.svg.append("g")

    

    for(const item of root.children) {
      const group = this.mainGroup.append("g")

      const circle =
        group
          .append("circle")
            .attr("fill", item.data.color)
            .attr("r", item.r)
            .on("click", () => {
              props.handler(props.data, item.data, props.type)
            })
            .attr("transform", `translate(${item.x},${item.y})`)
            .style("cursor", "pointer")

      const text =
        group
          .append("text")
          .style("fill", "white")
          .style("font-weight", "bold")
          .style("font-size", "10px")
          .style("cursor", "pointer")
          .text(item.data.label)
          .style("pointer-events", "none")

      if(text.node().getBoundingClientRect().width < (2 * item.r) * 0.8){
        text
          .attr("transform", `translate(${item.x - text.node().getBoundingClientRect().width/2},${item.y + text.node().getBoundingClientRect().height/4})`)
      } else {
        text.remove();
      }

      const showTooltip = () => 
      {
        d3.select(containerEl).selectAll("div").remove()
        if(!this.tooltip){

          this.tooltip = d3.select(containerEl)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("padding", "0px");

          this.tooltip
            .style("text-align", "center")
            .style("width", "200px")
            .style("height", "auto")
            .transition()
            .duration(200)
            .style("opacity", 1)

          const tooltipDiv =
            this.tooltip
              .append("div")
                .attr("class", "ui bottom center popup transition visible")
                .style("display", "inline-block")
                .style("width", "200px")
                .style("margin-left", "auto")
                .style("margin-right", "auto")

          const tooltipContent =
            tooltipDiv
              .append("div")
                .attr("class", "content")
          
          tooltipContent
            .append("span")
            .text(`${item.data.label? item.data.label : "unknown"} `)
            .style("font-weight", "bold")
          
          tooltipContent
            .append("span")
            .text(`(${item.data.value? item.data.value : "unknown"})`);

          this.tooltip
            .style("position", "fixed")
            .style("left", circle.node().getBoundingClientRect().left - (tooltipDiv.node().getBoundingClientRect().width * 0.5) + item.r + "px")
            .style("top", circle.node().getBoundingClientRect().top + 1.5 * item.r + "px")
        }

      }

      const removeTooltip =(d) => {
        this.tooltip
          .remove();
        this.tooltip = null;
      }
      
      group
        .on("mouseover", showTooltip)
        .on("mouseleave", removeTooltip)
    }

  }

  remove = () => {
    this.svg.remove();
    if(!this.tooltip === null){this.tooltip.remove();}
    
  }

  
}

export default CirclePackD3;