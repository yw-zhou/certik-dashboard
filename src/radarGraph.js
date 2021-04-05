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
          ctx.beginPath();
          const angle = (2 * Math.PI) / config.data.labels.length;
          for (var i = 1; i <= config.data.labels.length; i++) {
            ctx.shadowColor = config.options.chartArea.shadowColor;
            ctx.shadowBlur = config.options.chartArea.shadowBlur;
            ctx.lineTo(
              xCenter + radius * Math.cos((i - 0.5) * angle),
              yCenter + radius * Math.sin((i - 0.5) * angle)
            );
            let xadd = 5 + radius * Math.cos((i + 3.5) * angle);
            let yadd = 20 + radius * Math.sin((i + 3.5) * angle);

            if (Math.abs(Math.cos((i + 3.5) * angle)).toFixed(2) === "0.00") {
              xadd -= 60;
            } else if (Math.cos((i + 3.5) * angle) < 0) {
              xadd -= 120;
            }

            if (Math.sin((i + 3.5) * angle) < 0) {
              yadd -= 100;
            }

            ctx.font = "14px Arial";
            ctx.fillStyle = "#333333";

            ctx.fillText(TITLES[i - 1], xCenter + xadd, yCenter + yadd);
            ctx.font = "12px Arial";
            ctx.fillStyle = "#999999";
            const descriptLines = this.formatNewlines(DESCRIPTIONS[i - 1]);
            for (const line in descriptLines) {
              yadd += 20;
              ctx.fillText(descriptLines[line], xCenter + xadd, yCenter + yadd);
            }
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
        // labels: TITLES.map((t, i) => this.formatNewlines(t, DESCRIPTIONS[i])),
        labels: fillerLabel,
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
  }

  formatNewlines(content) {
    let line = "";
    let formatted = [];
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
            height="650"
            width="1000"
          />
        </div>
      </Card>
    );
  }
}

export default RadarGraph;
