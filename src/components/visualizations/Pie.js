import React, { createRef, Component } from "react";
import * as d3 from "d3";

class Pie extends Component {
  windowWidth = window.innerWidth;
  tooltip = null;

  constructor(props) {
    super(props);

    this.oldData = {};
    this.oldAngles = {};
    this.refComponent = createRef();
    this.format = d3.format(".0%");
    this.legendItemsCount = 1;
    this.legendCollapsed = true;
  }

  componentDidMount() {
    this.id = new Date().getTime();

    this.updateOldData();
    this.init();

    if (this.props.data !== null) {
      this.update();
    }

    d3.select(window).on(`resize.pie${this.id}`, () => {
      this.resize();
    });
  }

  componentDidUpdate() {
    this.compareNewData();
  }

  compareNewData() {
    if (this.props.data === null) {
      return;
    }

    this.updateLoading();

    if (this.oldData.length !== this.props.data.length) {
      this.update();
      this.updateOldData();
    } else {
      for (let i = 0; i < this.props.data.length; i++) {
        let oldDataItem = this.oldData[i];
        let newDataItem = this.props.data[i];

        if (oldDataItem.percentage !== newDataItem.percentage) {
          i = this.props.data.length;
          this.update();
          this.updateOldData();
        }
      }
    }
  }

  updateLoading() {
    let newOpacity;
    if (this.props.isLoading) {
      newOpacity = 0.1;
    } else {
      newOpacity = 1;
    }

    this.svg
      .select("#pie-group")
      .transition()
      .duration(200)
      .attr("opacity", newOpacity);
  }

  updateOldData() {
    this.oldData = this.props.data === null ? [] : this.props.data.slice(0);
  }

  componentWillUnmount() {
    d3.select(window).on(`resize.pie${this.id}`, null);
  }

  getSVGHeight() {
    return (
      this.innerRadius * 2 +
      this.legendItemsCount * this.legendEntryHeight +
      this.toggleLegendHeight
    );
  }

  setSize() {
    if (this.refComponent.current) {
      this.toggleLegendRightOffset = 55;
      this.legendEntryHeight = 20;
      this.toggleLegendHeight = 15;
      this.width = this.refComponent.current.parentNode.clientWidth - 30;
      this.innerRadius = this.width / 4;
      this.outerRadius = this.innerRadius / 2;
      // Set height based in innerRadius and add offset to legend and toggle legend
      this.height = this.getSVGHeight();
      this.legendYPosition = this.innerRadius * 2 + 10;
    }
  }

  init() {
    this.setSize();

    this.createPie = d3
      .pie()
      .value((d) => d.percentage)
      .sort(null);

    this.createArc = d3
      .arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius);

    this.svg = d3.select(this.svgEl);

    this.svg
      .attr("class", "chart")
      .attr("width", this.width)
      .attr("height", this.height);

    this.group = this.svg
      .append("g")
      .attr("id", "pie-group")
      .attr("transform", `translate(${this.width / 2}, ${this.innerRadius})`);

    this.svg.append("g").attr("id", "legend");

    this.svg
      .append("text")
      .attr("id", "legend-toggle")
      .attr("text-anchor", "middle")
      .style("font-size", 11)
      .style("cursor", "pointer")
      .text("show more")
      .attr("x", this.width / 2)
      .attr("y", this.getSVGHeight())
      .on("click", (d, i, node) => {
        this.legendCollapsed = !this.legendCollapsed;

        if (this.legendCollapsed === true) {
          d3.select(node[0]).text("show more");
        } else {
          d3.select(node[0]).text("show less");
        }

        this.toggleLegend();
      });
  }

  update() {
    this.legendCollapsed = true;
    this.toggleLegend();
    this.setLegend();

    const data = this.createPie(
      this.props.data.sort((a, b) => {
        return b.value - a.value;
      })
    );

    const arcGroup = this.group.selectAll(".arc-group").data(data, (d) => {
      return d.data.label;
    });

    const arcGroupEnter = arcGroup
      .enter()
      .append("g")
      .attr("class", "arc-group")
      .attr("opacity", 1);

    arcGroupEnter
      .append("path")
      .attr("class", "arc")
      .style("cursor", "pointer")
      .attr("fill", (d, i) => d.data.color)
      .on("click", (d) =>
        this.props.handler(this.props.data, d.data, this.props.type)
      )
      .on("mouseover", (d) => {
        // Define the div for the tooltip
        this.tooltip = d3
          .select(this.refComponent.current)
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        this.tooltip
          .style("width", "200px")
          .style("height", "auto")
          .style("padding", "10px")
          .transition()
          .duration(200)
          .style("opacity", 1);

        const tooltipDiv = this.tooltip
          .append("div")
          .attr("class", "ui bottom left popup transition visible")
          .style("display", "inline-block")
          .style("width", "200px")
          .style("margin-left", "auto")
          .style("margin-right", "auto");

        const tooltipContent = tooltipDiv
          .append("div")
          .attr("class", "content");

        tooltipContent
          .append("span")
          .text(`${d.data.label ? d.data.label : "unknown"} `)
          .style("font-weight", "bold");

        tooltipContent
          .append("span")
          .text(
            `(${
              d.data.percentage ? this.format(d.data.percentage) : "unknown"
            })`
          );

        this.tooltip
          .style("position", "fixed")
          .style("left", d3.event.x - 20 + "px")
          .style("top", d3.event.y + "px");
      })
      .on("mouseout", (d) => {
        this.tooltip.remove();
      });

    arcGroupEnter
      .append("text")
      .style("fill", (d) => (["LOW"].includes(d.data.label) ? "gray" : "white"))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");

    const merge = arcGroupEnter.merge(arcGroup);

    merge
      .select("path")
      .transition()
      .duration(1000)
      .attrTween("d", (d) => {
        const currentArc = this.oldAngles[d.data.label] || {
          startAngle: 2 * Math.PI,
          endAngle: 2 * Math.PI,
        };
        const interpolate = d3.interpolate(currentArc, d);

        return (t) => {
          return this.createArc(interpolate(t));
        };
      })
      .on("end", (d) => {
        this.oldAngles[d.data.label] = { ...d };
      });

    merge
      .select("text")
      .style("font-size", 10)
      .text((d) => (d.value < 0.005 ? "" : this.format(d.value)))
      .transition()
      .duration(1000)
      .attr("x", (d) => {
        return this.createArc.centroid(d)[0];
      })
      .attr("y", (d) => {
        return this.createArc.centroid(d)[1];
      });

    arcGroup
      .exit()
      .select("path")
      .transition()
      .duration(1000)
      .attrTween("d", (d) => {
        const currentArc = this.oldAngles[d.data.label];
        const interpolate = d3.interpolate(currentArc, {
          startAngle: 2 * Math.PI,
          endAngle: 2 * Math.PI,
        });

        return (t) => {
          return this.createArc(interpolate(t));
        };
      })
      .on("end", (d) => {
        this.oldAngles[d.data.label] = {
          startAngle: 2 * Math.PI,
          endAngle: 2 * Math.PI,
        };
      });

    arcGroup
      .exit()
      .select("text")
      .transition()
      .duration(1000)
      .attr("x", (d) => {
        return this.createArc.centroid({
          startAngle: 2 * Math.PI,
          endAngle: 2 * Math.PI,
        })[0];
      })
      .attr("y", (d) => {
        return this.createArc.centroid({
          startAngle: 2 * Math.PI,
          endAngle: 2 * Math.PI,
        })[1];
      });

    arcGroup.exit().transition().duration(1000).attr("opacity", 0).remove();
  }

  wrap(width, padding) {
    return function () {
      var self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text();

      const value = text.slice(text.indexOf("("), text.indexOf(")") + 1);

      while (textLength > width - 2 * padding && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + "…" + value);
        textLength = self.node().getComputedTextLength();
      }
    };
  }

  setLegend() {
    let filteredData;

    this.props.data.sort((a, b) => {
      return b.value - a.value;
    });

    //set default visible legend
    filteredData = this.legendCollapsed
      ? this.props.data.slice(0, 4)
      : this.props.data;

    this.legendItemsCount = filteredData.length;
    // hide show more when all legends are visibles
    var visibility =
      this.legendCollapsed && this.props.data.length === filteredData.length
        ? "hidden"
        : "visible";
    this.svg.select("#legend-toggle").style("visibility", visibility);

    const legendGroup = this.svg
      .select("#legend")
      .attr("transform", (d) => `translate(0, ${this.legendYPosition})`)
      .selectAll(".legend-entry")
      .data(filteredData, (d) => {
        return d.label;
      });

    const legendGroupEnter = legendGroup
      .enter()
      .append("g")
      .attr("class", "legend-entry");

    legendGroupEnter
      .append("rect")
      .attr("class", "legend-rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => {
        return d.color;
      });

    legendGroupEnter
      .append("text")
      .append("tspan")
      .attr("class", (d) =>
        d.selected ? "legend-text selected" : "legend-text"
      )
      .attr("x", 15)
      .style("font-size", 12)
      .style("cursor", "pointer")
      .style("font-weight", (d) => (d.selected ? "bolder" : "normal"))
      .attr("y", 10)
      .on("click", (d) =>
        this.props.handler(this.props.data, d, this.props.type)
      )
      .on("mouseover", (d) => {
        this.tooltip = d3
          .select(this.refComponent.current)
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        this.tooltip
          .style("width", "200px")
          .style("height", "auto")
          .style("padding", "10px")
          .transition()
          .duration(200)
          .style("opacity", 1);

        const tooltipDiv = this.tooltip
          .append("div")
          .attr("class", "ui bottom left popup transition visible")
          .style("display", "inline-block")
          .style("width", "200px")
          .style("margin-left", "auto")
          .style("margin-right", "auto");

        const tooltipContent = tooltipDiv
          .append("div")
          .attr("class", "content");

        tooltipContent
          .append("span")
          .text(`${d.label ? d.label : "unknown"} `)
          .style("font-weight", "bold");

        tooltipContent
          .append("span")
          .text(`(${d.percentage ? this.format(d.percentage) : "unknown"})`);

        this.tooltip
          .style("position", "fixed")
          .style("left", d3.event.x - 20 + "px")
          .style("top", d3.event.y + "px");

        this.svg
          .selectAll(".arc")
          .attr("opacity", 1)
          .attr("opacity", function (e) {
            if (e.data.label !== d.label) {
              return 0.2;
            } else {
              return 1;
            }
          });
      })
      .on("mouseout", (d) => {
        this.tooltip.transition().remove();

        this.svg
          .selectAll(".arc")
          .transition()
          .duration(200)
          .attr("opacity", 1);
      });

    const merge = legendGroupEnter.merge(legendGroup);

    merge
      .attr("transform", (d, i) => {
        return `translate(0, ${this.legendEntryHeight * i})`;
      })
      .select("tspan")
      .text((d) => {
        return `${d.label ? d.label : "unknown"} (${d.value})`;
      })
      .each(this.wrap(this.width, 10));

    legendGroup.exit().remove();
  }

  toggleLegend() {
    this.setLegend();
    this.updateToggleLegendPosition();

    this.svg.transition().duration(500).attr("height", this.getSVGHeight());
  }

  updateToggleLegendPosition() {
    this.svg
      .select("#legend-toggle")
      .transition()
      .duration(500)
      .attr("y", this.getSVGHeight());
  }

  resize() {
    this.setSize();

    this.svg.attr("width", this.width).attr("height", this.height);

    this.createPie = d3
      .pie()
      .value((d) => d.percentage)
      .sort(null);

    this.createArc = d3
      .arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius);

    this.svg
      .select("#pie-group")
      .attr("transform", `translate(${this.width / 2}, ${this.innerRadius})`);

    this.svg
      .select("#legend")
      .attr("transform", (d) => `translate(0, ${this.legendYPosition})`);

    this.svg
      .select("#legend-toggle")
      .attr("x", this.width / 2)
      .attr("y", this.getSVGHeight());

    const arcGroup = this.svg.selectAll(".arc-group");

    arcGroup.select(".arc").attr("d", this.createArc);

    arcGroup
      .select("text")
      .attr("x", (d) => {
        return this.createArc.centroid(d)[0];
      })
      .attr("y", (d) => {
        return this.createArc.centroid(d)[1];
      });
  }

  render() {
    return (
      <div ref={this.refComponent}>
        <svg ref={(el) => (this.svgEl = el)}></svg>
      </div>
    );
  }
}

export default Pie;
