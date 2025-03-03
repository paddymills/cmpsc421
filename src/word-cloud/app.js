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

// did not find how to use D3.js to create a word cloud except from
// https://d3-graph-gallery.com/graph/wordcloud_size.html
async function generateWordCloud(term) {
  // List of words
  var myWords = await fetchWordCloudData(term);
  const mult =
    myWords.length > 0 ? 80 / Math.max(...myWords.map((w) => w.score)) : 1;
  myWords = myWords.map((word) => ({
    word: word.word,
    size: word.score * mult,
  }));
  console.log(myWords);

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  d3.select("#cloud").select("svg").remove();

  // append the svg object to the body of the page
  var svg = d3
    .select("#cloud")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3.layout
    .cloud()
    .size([width, height])
    .words(
      myWords.map(function (d) {
        return { text: d.word, size: d.size };
      }),
    )
    .padding(5) //space between words
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
    .fontSize(function (d) {
      return d.size;
    }) // font size of words
    .on("end", draw);
  layout.start();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")",
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d) {
        return d.size;
      })
      .style("fill", "#69b3a2")
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }
}
