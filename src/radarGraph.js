import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Chart from "chart.js";
import { TITLES, DESCRIPTIONS } from "./consts";

class RadarGraph extends Component {
  radarChartRef = React.createRef();

  componentDidMount() {
    Chart.pluginService.register({
      beforeDraw: (chart) => {
        const { ctx, scale, config } = chart;
        if (
          config.type === "radar" &&
          config.options.chartArea.backgroundColor
        ) {
          const { xCenter, yCenter, drawingArea: radius } = scale;
          ctx.save();
          ctx.shadowColor = config.options.chartArea.shadowColor;
          ctx.shadowBlur = config.options.chartArea.shadowBlur;
          ctx.beginPath();
          const angle = (2 * Math.PI) / config.data.labels.length;
          for (var i = 1; i <= config.data.labels.length; i++) {
            ctx.lineTo(
              xCenter + radius * Math.cos((i + 0.5) * angle),
              yCenter + radius * Math.sin((i + 0.5) * angle)
            );
          }

          ctx.closePath();
          ctx.fillStyle = config.options.chartArea.backgroundColor;
          ctx.fill();
          ctx.restore();
        }
      },
    });

    const myRadarChartRef = this.radarChartRef.current.getContext("2d");
    myRadarChartRef.height = 800;
    new Chart(myRadarChartRef, {
      type: "radar",
      data: {
        labels: TITLES.map((t, i) => this.formatNewlines(t, DESCRIPTIONS[i])),
        // labels: ["", "", "", "", "", ""],
        datasets: [
          {
            data: this.props.data,
            fill: true,
            backgroundColor: "rgba(73, 128, 202, 0.4)",
            borderColor: "rgb(73, 128, 202)",
            pointBackgroundColor: "rgb(73, 128, 202)",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(73, 128, 202)",
          },
        ],
      },
      options: {
        // maintainAspectRatio: false,
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
          maxHeight: 100,
          maxWidth: 100,
        },
        chartArea: {
          maintainAspectRatio: false,
          responsive: true,
          backgroundColor: "white",
          shadowColor: "#aaaaaa",
          shadowBlur: 10,
        },
        elements: {
          line: {
            borderWidth: 1,
          },
        },
      },
    });
    // radarChart.resize(1200, 1200);
  }

  formatNewlines(title, content) {
    let line = "";
    let formatted = [title];
    for (var i = 0; i < content.length; i++) {
      line += content[i];
      if (
        (content[i] === " " && line.length > 18) ||
        i + 1 === content.length
      ) {
        formatted.push(line);
        line = "";
      }
    }

    return formatted;
  }

  render() {
    return (
      <Card className="h-100 overflow-hidden d-flex flex-column align-items-center justify-content-center light-grey border-0">
        <div className="radar-wrapper ">
          <canvas
            id="mainChart"
            ref={this.radarChartRef}
            height="200"
            // width="200"
          />
        </div>
      </Card>
    );
  }
}

export default RadarGraph;
