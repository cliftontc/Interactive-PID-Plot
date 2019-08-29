import React, { Component } from "react";
import * as d3 from "d3";
import { GetPoints } from "./pid-functions/PidFunctions";

const margin = { top: 40, right: 40, bottom: 40, left: 40 };
const width = 800;
const height = 400;
const red = "#eb6a5b";
const blue = "#52b6ca";

const points = GetPoints();
const initialSpArr = points.GetSpArr().slice(0,200);
const initialPvArr = [];

for (var i = 0; i < 100; i++) {
  initialPvArr.push(0);
}

class PidPlot extends Component {
  constructor() {
    super();
    this.state = {
      pTerm: 50, //proportional tuning parameter
      iTerm: 50, //integral tuning parameter
      dTerm: 50, //derivative tuning parameter
      setpoint: initialSpArr,
      processVar: initialPvArr,
      currSVG: null,
      isMounted: false
    };
    this.plotGraph = this.plotGraph.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.tick = this.tick.bind(this);
  }
  componentDidMount() {
    this.setState({
      isMounted: true,
      currSVG: this.plotGraph(initialSpArr, initialPvArr)
    });
    requestAnimationFrame(this.tick);
  }
  tick() {
    if (this.state.isMounted) {
      var pidParams = [this.state.pTerm, this.state.iTerm, this.state.dTerm];
      var datasets = points.GetPoints(pidParams);
      //this.setState({
        //setpoint: datasets[0],
        //processVar: datasets[1],
        //currSVG: this.plotGraph(datasets[0], datasets[1])
      //});
      requestAnimationFrame(this.tick);
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  plotGraph(spData, pvData) {
    var spDataset = spData;
    var pvDataset = pvData;

    const n = 200; // number of data points 
    
    //based on setpoints and ranges of tuning params 
    //  -0.2 < pv < 0.8 was assumed
    const pvMax = 0.8;
    const pvMin = -0.2;

    var xScale = d3
      .scaleLinear()
      .domain([0, n - 1])
      .range([margin.left, width - margin.right]);

    var yScale = d3
      .scaleLinear()
      .domain([pvMin, pvMax]) 
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom().scale(xScale);

    const yAxis = d3
      .axisLeft()
      .scale(yScale)
      .ticks(5);

    const lineGen = d3
      .line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    const spLinePath = lineGen(spDataset);
    const pvLinePath = lineGen(pvDataset);

    var svgJsx = (
      <div id="svg-container">
        <svg width={width} height={height}>
          <path d={spLinePath} fill="none" stroke={blue} strokeWidth="2" />
          <path d={pvLinePath} fill="none" stroke={red} strokeWidth="2" />
          <g
            className="xAxis"
            ref={node => d3.select(node).call(xAxis)}
            style={{
              transform: `translateY(${height - margin.bottom}px)`,
              fontSize: "0"
            }}
          />
          <g
            className="yAxis"
            ref={node => d3.select(node).call(yAxis)}
            style={{
              transform: `translateX(${margin.left}px)`,
              fontSize: "10px"
            }}
          />
        </svg>
      </div>
    );

    return svgJsx;
  }

  render() {
    return (
      <content>
        <div>
          <h1>{this.state.currSVG}</h1>
        </div>
        <div>
          <input
            type="range"
            class="custom-range"
            name="pidSlider"
            id="pTerm"
            onChange={this.handleChange}
          />
          <input
            type="range"
            class="custom-range"
            name="pidSlider"
            id="iTerm"
            onChange={this.handleChange}
          />
          <input
            type="range"
            class="custom-range"
            name="pidSlider"
            id="dTerm"
            onChange={this.handleChange}
          />
        </div>
      </content>
    );
  }
}
export default PidPlot;
