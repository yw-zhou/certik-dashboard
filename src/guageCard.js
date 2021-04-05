import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import Chart from "chart.js";
import { TEXT_COLOR } from "./consts";
import { BoxArrowUpRight } from "react-bootstrap-icons";

function GuageCard(props) {
  const chartRef = React.createRef();

  // set status of attribute which maps to color from consts
  let status = "Average";
  if (props.data.score >= 90) {
    status = "Excellent";
  } else if (props.data.score > 70) {
    status = "Good";
  }

  //set property description based on name
  let description;
  if (props.data.name === "static-analysis") {
    description = (
      <p>
        <span style={{ color: TEXT_COLOR[status] }} className="fw-bold">
          {props.data.issues}
        </span>
        &nbsp;issues detected out of&nbsp;
        <span className="fw-bold">{props.data.checks}</span>
        &nbsp;vulnerability and security checks
      </p>
    );
  } else if (props.data.name === "governance-autonomy") {
    description = (
      <p>
        <span style={{ color: TEXT_COLOR[status] }} className="fw-bold">
          {props.data.issues}
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
      "social-sentiment": " based on social monitoring and sentiment analysis",
      "market-volatility":
        " based on indicators over trading volume/liquidity/depth",
      "safety-assessment": ` based on ${props.data.checks} safety and hazard evaluations`,
    };
    description = (
      <p>
        <span style={{ color: TEXT_COLOR[status] }} className="fw-bold">
          {status}
        </span>
        {GUAGE_DESCRIPTION[props.data.name]}
      </p>
    );
  }

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    //generate datapoints to simulate the 4 quarter sections in guage chart from UI
    let dataPoints = Array(parseInt(props.data.score / 25)).fill(25);
    dataPoints.push(props.data.score % 25, 100 - props.data.score);
    let backgroundColorSet = Array(dataPoints.length - 1).fill(
      TEXT_COLOR[status]
    );
    backgroundColorSet.push(
      TEXT_COLOR[status].substring(0, TEXT_COLOR[status].length - 1) + ", 0.2)"
    );

    //generate chart
    new Chart(myChartRef, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: dataPoints,
            backgroundColor: backgroundColorSet,
            borderWidth: { right: 1 },
          },
        ],
      },
      options: {
        circumference: Math.PI + 1,
        rotation: -Math.PI - 0.5,
        cutoutPercentage: 70,
        tooltips: {
          enabled: false,
        },
        chartArea: {
          backgroundColor: "#e4e4e4",
          thickness: 5,
        },
        data: props.data.score,
      },
    });
  }, []);

  return (
    <Card className="light-grey border-0 pl-2 pt-2 d-flex flex-row">
      <div>
        <h6 className="fw-bold">{props.title}</h6>
        {description}
      </div>
      <div className="small-width ml-auto position-relative">
        <canvas id="sideGuage" ref={chartRef} />
        {/* add score to center of guage chart */}
        <p className="fw-bold score">{props.data.score}</p>
      </div>
    </Card>
  );
}
export default GuageCard;
