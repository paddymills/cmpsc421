window.onload = () => {
  // fetch: https://datausa.io/api/data?drilldowns=Nation&measures=Population
  fetch("https://datausa.io/api/data?drilldowns=Nation&measures=Population")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let elem = document.getElementById("chart");
      elem.childNodes[0].remove();
      createChart(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

function createChart(data) {
  const width = 800;
  const height = 600;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 100;

  const x = d3.scaleUtc(
    d3.extent(data.data, (d) => new Date(d.Year)),
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(
    [0, d3.max(data.data, (d) => d.Population)],
    [height - marginBottom, marginTop],
  );

  const line = d3
    .line()
    .x((d) => x(new Date(d.Year)))
    .y((d) => y(d.Population));

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("path")
    .datum(data.data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add the x-axis.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0),
    );

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1),
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Population"),
    );
}
