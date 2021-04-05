import Chart from "chart.js";
import { TITLES, DESCRIPTIONS } from "./consts";

export default function registerChartPlugin() {
  Chart.pluginService.register({
    // add listener to draw custom UI onto canvas before Chart
    beforeDraw: (chart) => {
      const { ctx, scale, config, innerRadius, chartArea } = chart;
      const options = config.options;
      // check that the custom option exists to make it portable and also
      //prevent other charts from having the same effect
      ctx.save();
      //radar chart
      if (config.type === "radar" && options.chartArea.backgroundColor) {
        const { xCenter, yCenter, drawingArea: radius } = scale;
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
          ctx.fillStyle = "#35455a";
          //title label in bold
          ctx.fillText(TITLES[i - 1], xCenter + xadd, yCenter + yadd);

          //draws each of the sub-label lines
          ctx.font = "12px Arial";
          ctx.fillStyle = "#959595";
          const descriptLines = formatNewlines(DESCRIPTIONS[i - 1]);
          for (const line in descriptLines) {
            yadd += 20;
            ctx.fillText(descriptLines[line], xCenter + xadd, yCenter + yadd);
          }
        }

        ctx.shadowColor = options.chartArea.shadowColor;
        ctx.shadowBlur = options.chartArea.shadowBlur;
        ctx.closePath();
        ctx.fillStyle = options.chartArea.backgroundColor;
        ctx.fill();
      }
      //guage chart
      if (config.type === "doughnut" && options.data) {
        // find center and draw the smaller grey arc from figma
        const centerX = chart.chart.width / 2;
        const centerY =
          (chartArea.top + chartArea.bottom) / 2 + chart.chart.offsetY;
        let calcAngle = options.rotation + options.circumference;
        ctx.lineWidth = options.chartArea.thickness;
        ctx.strokeStyle = options.chartArea.backgroundColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius - 2, options.rotation, calcAngle);
        ctx.stroke();

        // using the score and total circumference, calculate the gauge endpoint
        // and draw triangle at that position
        ctx.beginPath();
        calcAngle =
          options.rotation + (options.circumference * options.data) / 100;
        ctx.moveTo(
          centerX + innerRadius * Math.cos(calcAngle),
          centerY + innerRadius * Math.sin(calcAngle)
        );
        for (let i = -1; i < 2; i += 2) {
          calcAngle =
            options.rotation +
            (options.circumference * (options.data + 3 * i)) / 100;
          ctx.lineTo(
            centerX + (innerRadius - 5) * Math.cos(calcAngle),
            centerY + (innerRadius - 5) * Math.sin(calcAngle)
          );
        }
        ctx.closePath();
        ctx.fill();
      }
      // restores all previous canvas settings to not effect chart drawings
      ctx.restore();
    },
  });
}

// wraps long lines by turning them into array
function formatNewlines(content) {
  let line = "";
  let formatted = [];
  for (var i = 0; i < content.length; i++) {
    line += content[i];
    if ((content[i] === " " && line.length > 18) || i + 1 === content.length) {
      formatted.push(line);
      line = "";
    }
  }

  return formatted;
}
