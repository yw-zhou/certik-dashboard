import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Chart from "chart.js";
import { TITLES, DESCRIPTIONS } from "./consts";

class RadarGraph extends Component {
  radarChartRef = React.createRef();

  componentDidMount() {
    Chart.pluginService.register({
      // add listener to draw custom UI onto canvas before Chart
      beforeDraw: (chart) => {
        const { ctx, scale, config } = chart;
        // check that the custom option exists to make it portable and also
        //prevent other charts from having the same effect
        if (
          config.type === "radar" &&
          config.options.chartArea.backgroundColor
        ) {
          const { xCenter, yCenter, drawingArea: radius } = scale;
          ctx.save();
          ctx.beginPath();
          const angle = (2 * Math.PI) / config.data.labels.length;
          // draws the regular polygon, creates shadow, and fills it with backgroundColor (white)
          for (var i = 1; i <= config.data.labels.length; i++) {
            ctx.lineTo(
              xCenter + radius * Math.cos((i - 0.5) * angle),
              yCenter + radius * Math.sin((i - 0.5) * angle)
            );

            // manually drawing the labels below. Generally ChartJS supports labels however it can not
            // support styling partial labels (such as making main label bold with normal sublabels)
            // if the design decision is to forego the bolding to trade for flexibility
            // please refer to commit 379712b1b5c084f1dece6cc2acb8768f5ee30680

            //calculates coordinates for where labels should be
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
            //title label in bold
            ctx.fillText(TITLES[i - 1], xCenter + xadd, yCenter + yadd);

            //draws each of the sub-label lines
            ctx.font = "12px Arial";
            ctx.fillStyle = "#999999";
            const descriptLines = this.formatNewlines(DESCRIPTIONS[i - 1]);
            for (const line in descriptLines) {
              yadd += 20;
              ctx.fillText(descriptLines[line], xCenter + xadd, yCenter + yadd);
            }
          }

          ctx.shadowColor = config.options.chartArea.shadowColor;
          ctx.shadowBlur = config.options.chartArea.shadowBlur;
          ctx.closePath();
          ctx.fillStyle = config.options.chartArea.backgroundColor;
          ctx.fill();
          //restores all previous canvas settings to not effect chart drawings
          ctx.restore();
        }
      },
    });

    const myRadarChartRef = this.radarChartRef.current.getContext("2d");
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
        },
        // custom option attributes for before draw listener above
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

  // wraps long lines by turning them into array
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
          <canvas ref={this.radarChartRef} height="650" width="1000" />
        </div>
      </Card>
    );
  }
}

export default RadarGraph;
