import React, { Component }  from 'react';
import * as d3 from "d3";

class BarChart extends Component {

  componentDidMount() {
    this.id = new Date().getTime();

    this.updateOldData();
    this.init();

    if(this.props.data !== null) {
      this.update();
    }

    d3.select(window).on(`resize.bar${this.id}`, () => {
      this.resize();
    });
  }

  componentWillUnmount() {
    d3.select(window).on(`resize.bar${this.id}`, null);
  }

  componentDidUpdate() {
    this.compareNewData();
  }

  compareNewData() {
    if(this.props.data === null) {
      return;
    }

    this.updateLoading();

    if(this.oldData.length !== this.props.data.length) {
      this.update();
      this.updateOldData();
    } else {
      for(let i=0; i<this.props.data.length; i++) {
        let oldDataItem = this.oldData[i];
        let newDataItem = this.props.data[i];

        if(oldDataItem.xValue !== newDataItem.xValue || oldDataItem.yValue !== newDataItem.yValue) {
          i = this.props.data.length;
          this.update();
          this.updateOldData();
        }
      }
    }
  }

  updateOldData() {
    this.oldData = this.props.data === null ? [] : this.props.data.slice(0);
  }

  updateLoading() {
    let newOpacity;
    if(this.props.isLoading) {
      newOpacity = 0.1;
    } else {
      newOpacity = 1;
    }

    this.svg.select("#bars")
      .transition()
      .duration(200)
      .attr("opacity", newOpacity);
  }

  setSize() {
    this.margin = {top: 5, right: 10, bottom: 30, left: 32};

    this.width = this.refs.child.parentNode.clientWidth - this.margin.left - this.margin.right;
    this.height = this.width*0.65 - this.margin.top - this.margin.bottom;
    this.height = this.height < 0 ? 0 : this.height;

    this.x = d3.scaleTime().rangeRound([0, this.width]);
    this.y = d3.scaleLinear().rangeRound([this.height, 0]);

    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y).tickFormat(
      function (d) {
        if (d > 1000 && d < 1000000) {
          d = d / 1000 + "K";
        } else if(d >= 1000000) {
          d = d / 1000000 + "M";
        }
        return d;
      }
    ).ticks(7);

    d3.select(this.svgEl)
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);
  }

  setTicks() {
    const xDomain = this.x.domain();
    const date1 = xDomain[0];
    const date2 = xDomain[ xDomain.length-1 ];
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if(this.props.range === 'DAY') {
      this.xAxis.tickFormat(d3.timeFormat('%H:%M'));
    } else {
      this.xAxis.tickFormat(d3.timeFormat("%m/%d"));
    }

    // Calculate number of ticks
    if(this.props.range === 'DAY') {
      this.xAxis.ticks( d3.timeHour.every(3) );
    } else {
      if(diffDays > 5 && diffDays < 12) {
        this.xAxis.ticks( d3.timeDay.every(1) );
      } else {
        this.xAxis.ticks( d3.timeDay.every(3) );
      }
    }
  }

  resize() {
    this.setSize();
    this.setTicks();

    const barPadding = 3;
    const barWidth = this.width / this.props.barsCount;

    this.svg
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)

    this.x.rangeRound([0, this.width]);
    this.y.rangeRound([this.height, 0]);

    this.x.domain([
      this.props.domain.from,
      this.props.domain.to,
    ]); 

    this.y.domain( [0, this.yDomainTo] );

    this.xAxis.scale(this.x);
    this.yAxis.scale(this.y);

    this.svg.select('.x.axis')
      .transition()
      .duration(500)
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.svg.select('.y.axis')
      .transition()
      .duration(500)
      .call(this.yAxis);
      
    this.svg.selectAll("rect")
      .attr("x", (d) => {
        return this.x( new Date( d.xValue)) - barWidth/2 + barPadding/2;
      })
      .transition()
      .duration(500)
      .attr("width", () => {
        return barWidth - barPadding;
      })
      .attr("y", (d) => {
        return this.y(d.yValue);
      })
      .attr("height", (d) => {
        const value = this.height - this.y(d.yValue);
        return value < 0 ? 0 : value;
      });
  }

  init() {
    this.setSize();

    this.svg = d3.select(this.svgEl)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('font-size', '11px')
      .attr('transform', 'translate(0,' + this.height + ')');

    this.svg.append('g')
      .attr('class', 'y axis')
      .attr('font-size', '11px');

    this.svg.append('g')
      .attr('id', 'bars');
  }

  setAxis() {
    // We want to remove the extra ticks added at start and stop
    // First we hide all the text, then update axis, then remove the extra ticks
    // and finally we show the updated axis
    this.svg.select('.x.axis.text')
      .attr('opacity', 0);

    this.svg.select('.x.axis')
      .call(this.xAxis);

    this.svg.select('.x.axis')
      .selectAll('text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(50)')
      .style('text-anchor', 'start')
      .attr('opacity', (d, i) => {
        // if (i === 0) {
        //   return 0;
        // } else {
          return 1;
        // }
      });

    this.svg.select('.x.axis')
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    this.svg.select('.y.axis')
      .transition()
      .duration(1000)
      .call(this.yAxis);
  }
    
  update() {
    const xDomainExtent = this.props.domain;
    const data = this.props.data;
    const barsCount = this.props.barsCount;

    if(xDomainExtent !== undefined) {
      this.x.domain([
        xDomainExtent.from,
        xDomainExtent.to,
      ]); 
    }

    this.yDomainTo = d3.max(data, (d) => d.yValue);

    if (isNaN(this.yDomainTo) || this.yDomainTo === 0) {
      this.yDomainTo = 1;
    }

    this.y.domain( [0, this.yDomainTo] );

    // Calculate bar width
    const barPadding = 3;
    const barWidth = this.width / barsCount;

    this.setTicks();
    this.setAxis();

    const bars = this.svg.select("#bars").selectAll("rect")
      .data(data);

    const barsEnter = bars
      .enter()
      .append("rect")
      .attr("fill", (d) => {
        if(d.color) {
          return d.color;
        } else {
          return "#5d9cec";
        }
      })
      .attr("x", (d) => {
        return this.x( new Date( d.xValue)) - barWidth/2 + barPadding/2;
      })
      .attr("y", (d) => {
        return this.height;
      })
      .attr("height", (d) => {
        return 0;
      })
      .on("mouseover", (d) => {
        // Define the div for the tooltip
        this.tooltip = d3.select('body').append("div")	
          .attr("class", "tooltip")				
          .style("opacity", 0);

        this.tooltip.transition()		
          .duration(200)
          .style("opacity", 1)
          .style("width", "180px")
          .style("height", "auto")
          .style("padding", "10px");

        let format = d3.timeFormat("%b %e %H:%M");
        if (d.xValue.getHours() === 0 && d.xValue.getHours() === 0) {
          format = d3.timeFormat("%b %e");
        } else {
          format = d3.timeFormat("%b %e %H:%M");
        }

        let tooltipContent = `<div><strong>Date: </strong> ${format(d.xValue)}</div><div><strong>Value: </strong> ${d.yValue}</div>`;
        
        tooltipContent = `<div class="ui top left popup transition visible" style="width:100%"><div class="content">${tooltipContent}</div></div>`

        const leftPosition = d3.event.pageX - 20;
        const topPosition = d3.event.pageY - 75;

        this.tooltip.html(tooltipContent)	
          .style("left", `${leftPosition}px`)
          .style("top", `${topPosition}px`)
      })
      .on("mouseout", (d) => {
        this.tooltip
          .remove();
      });

    barsEnter.merge(bars)
      .attr("x", (d) => {
        return this.x( new Date( d.xValue)) - barWidth/2 + barPadding/2;
      })
      .transition()
      .duration(750)
      .ease(d3.easePolyOut)
      .attr("width", () => {
        return barWidth - barPadding;
      })
      .attr("y", (d) => {
        return this.y(d.yValue);
      })
      .attr("height", (d) => {
        const value = this.height - this.y(d.yValue);
        return value < 0 ? 0 : value;
      });

    bars.exit()
      .remove();
  }

  render() {
    return <div ref="child"><svg ref={el => this.svgEl = el} ></svg></div>
  }
}
    
export default BarChart;