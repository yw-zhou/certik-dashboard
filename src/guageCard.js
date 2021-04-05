import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Chart from "chart.js";
import { TEXT_COLOR } from "./consts";
import { BoxArrowUpRight } from "react-bootstrap-icons";

class GuageCard extends Component {
  state = {};
  chartRef = React.createRef();

  componentDidMount() {
    // { name: "static-analysis", issues: 41, checks: 400, score: 90 },
    let status = "Average";
    if (this.props.data.score >= 90) {
      status = "Excellent";
    } else if (this.props.data.score > 70) {
      status = "Good";
    }
    let description;
    if (this.props.data.name === "static-analysis") {
      description = (
        <p>
          <span style={{ color: TEXT_COLOR[status] }} className="fw-bold">
            {this.props.data.issues}
          </span>
          &nbsp;issues detected out of&nbsp;
          <span className="fw-bold">{this.props.data.checks}</span>
          &nbsp;vulnerability and security checks
        </p>
      );
    } else if (this.props.data.name === "governance-autonomy") {
      description = (
        <p>
          <span style={{ color: TEXT_COLOR[status] }} className="fw-bold">
            {this.props.data.issues}
          </span>
          &nbsp;security-type certificate found on&nbsp;
          <a href="https://www.certik.org/" className="alert-link">
            Certik Chain&nbsp;
            <BoxArrowUpRight />
          </a>
        </p>
      );
    } else {
      const GUAGE_DESCRIPTION = {
        "onchain-monitoring":
          " based on real-time transactional tracking systems",
        "social-sentiment":
          " based on social monitoring and sentiment analysis",
        "market-volatility":
          " based on indicators over trading volume/liquidity/depth",
        "risk-assessment": `based on ${this.props.data.checks} safety and hazard evaluations`,
      };
      description = (
        <p>
          <span style={{ color: TEXT_COLOR[status] }} className="fw-bold">
            {status}
          </span>
          {GUAGE_DESCRIPTION[this.props.data.name]}
        </p>
      );
    }
    this.setState({ description });

    const myChartRef = this.chartRef.current.getContext("2d");
    let dataPoints = Array(parseInt(this.props.data.score / 25)).fill(25);
    dataPoints.push(100 - this.props.data.score);

    new Chart(myChartRef, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: dataPoints,
            backgroundColor: Array(dataPoints.length - 1).fill(
              TEXT_COLOR[status]
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        circumference: Math.PI + 1,
        rotation: -Math.PI - 0.5,
        cutoutPercentage: 60,
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  render() {
    return (
      <Card className="light-grey border-0 pl-2 pt-2 d-flex flex-row">
        <div>
          <h6 className="fw-bold">{this.props.title}</h6>
          {this.state.description}
        </div>
        <div className="small-width ml-auto position-relative">
          <canvas id="sideGuage" ref={this.chartRef} />
          <p className="fw-bold score">{this.props.data.score}</p>
        </div>
      </Card>
    );
  }
}
export default GuageCard;
