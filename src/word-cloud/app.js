window.onload = () => {
  document
    .getElementById("generate-btn")
    .addEventListener("click", async (e) => {
      let term = document.getElementById("word-input").value;
      console.log("search term:", term);
      await generateWordCloud(term);
    });

  if (window.location.search === "?env=dev") {
    console.log("Development environment detected");

    document.getElementById("word-input").value = "example";
    document.getElementById("generate-btn").click();
  }
};

async function fetchWordCloudData(term) {
  try {
    // replace spaces with +
    const response = await fetch(
      `https://api.datamuse.com/words?rel_syn=${term.replace(/\s+/g, "+")}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching word cloud data:", error);
    return null;
  }
}

async function generateWordCloud(term) {
  const data = await fetchWordCloudData(term);
  if (data) {
    // Generate word cloud using data
    console.log(data);

    const width = 800;
    const height = 600;

    const words = data.map((d) => ({ text: d.word, size: d.score }));

    var cTemp = document.createElement("canvas"),
      ctx = cTemp.getContext("2d");
    ctx.font = "100px sans-serif";
    var fRatio = Math.min(width, height) / ctx.measureText(words[0].text).width,
      fontScale = d3.scale
        .linear()
        .domain([
          d3.min(words, function (d) {
            return d.size;
          }),
          d3.max(words, function (d) {
            return d.size;
          }),
        ])
        //.range([20,120]),
        .range([20, (100 * fRatio) / 2]), // tbc
      fill = d3.scale.category20();

    d3.layout
      .cloud()
      .size([width, height])
      .words(data.map((d) => ({ text: d.word, size: d.score })))
      //.padding(2) // controls
      .rotate(function () {
        return ~~(Math.random() * 2) * 90;
      })
      .font("sans-serif")
      .fontSize(function (d) {
        return fontScale(d.size);
      })
      .on("end", draw)
      .start();
  }
}

function draw(words, bounds) {
  cWidth = 800;
  cHeight = 600;

  // move and scale cloud bounds to canvas
  // bounds = [{x0, y0}, {x1, y1}]
  bWidth = bounds[1].x - bounds[0].x;
  bHeight = bounds[1].y - bounds[0].y;
  bMidX = bounds[0].x + bWidth / 2;
  bMidY = bounds[0].y + bHeight / 2;
  bDeltaX = cWidth / 2 - bounds[0].x + bWidth / 2;
  bDeltaY = cHeight / 2 - bounds[0].y + bHeight / 2;
  bScale = bounds ? Math.min(cWidth / bWidth, cHeight / bHeight) : 1;

  // the library's bounds seem not to correspond to reality?
  // try using .getBBox() instead?

  svg = d3
    .select(".cloud")
    .select("svg")
    .append("svg")
    .attr("width", cWidth)
    .attr("height", cHeight);

  wCloud = svg
    .append("g")
    //.attr("transform", "translate(" + [bDeltaX, bDeltaY] + ") scale(" + 1 + ")") // nah!
    .attr(
      "transform",
      "translate(" + [bWidth >> 1, bHeight >> 1] + ") scale(" + bScale + ")",
    ) // nah!
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", function (d) {
      return d.size + "px";
    })
    .style("font-family", "Arial")
    .style("fill", function (d, i) {
      return d3.scale.category20(i);
    })
    .attr("text-anchor", "middle")
    .transition()
    .duration(500)
    .attr("transform", function (d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function (d) {
      return d.text;
    });

  // TO DO: function to find min and max x,y of all words
  // and use it as the group's bbox
  // then do the transformation
  bbox = wCloud.node(0).getBBox();
  //ctm = wCloud.node().getCTM();
  console.log(
    "bbox (x: " +
      bbox.x +
      ", y: " +
      bbox.y +
      ", w: " +
      bbox.width +
      ", h: " +
      bbox.height +
      ")",
  );
}
