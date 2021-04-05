import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import Chart from "chart.js";

function RadarGraph(props) {
  const radarChartRef = React.createRef();

  useEffect(() => {
    const myRadarChartRef = radarChartRef.current.getContext("2d");
    // The chart automatically fills the entire canvas size preventing drawing space
    // for custom labels. The fillerLabel adjusts chart size for space.
    const fillerLabel = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    new Chart(myRadarChartRef, {
      type: "radar",
      data: {
        // comment below is ChartJS's own label drawing which doesn't support partial styling
        // labels: TITLES.map((t, i) => formatNewlines(t, DESCRIPTIONS[i])),
        labels: fillerLabel,
        datasets: [
          {
            data: props.data,
            fill: true,
            backgroundColor: "rgba(73, 128, 202, 0.5)",
            borderColor: "rgb(73, 128, 202)",
            pointBackgroundColor: "rgb(73, 128, 202)",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(73, 128, 202)",
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scale: {
          ticks: {
            beginAtZero: true,
            max: 100,
            stepSize: 20,
          },
          pointLabels: {
            fontSize: 14,
          },
          gridLines: {
            color: "#f1f1f1",
          },
        },
        // custom option attributes for before draw listener above
        chartArea: {
          backgroundColor: "white",
          shadowColor: "#e3e3e3",
          shadowBlur: 10,
        },
        elements: {
          line: {
            borderWidth: 1,
          },
        },
      },
    });
  }, []);

  return (
    <Card className="h-100 overflow-hidden d-flex flex-column align-items-center justify-content-center light-grey border-0">
      <div className="radar-wrapper ">
        <canvas ref={radarChartRef} height="650" width="1000" />
      </div>
    </Card>
  );
}

export default RadarGraph;
