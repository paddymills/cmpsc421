window.onload = () => {
  let word = document.getElementById("word-input");
  document
    .getElementById("generate-btn")
    .addEventListener("click", async (e) => {
      let term = word.value;
      console.log("search term:", term);
      await generateWordCloud(term);
    });
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

    let dest = document.getElementById("word-cloud");
    const cloud = WordCloud(data, {
      size: (g) => g.score,
      word: (d) => d.word,
    });
  }
}

// from https://observablehq.com/@d3/word-cloud
function WordCloud(
  text,
  {
    size = (group) => group.length, // Given a grouping of words, returns the size factor for that word
    word = (d) => d, // Given an item of the data array, returns the word
    marginTop = 0, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 0, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    maxWords = 250, // maximum number of words to extract from the text
    fontFamily = "sans-serif", // font family
    fontScale = 15, // base font size
    fill = null, // text color, can be a constant or a function of the word
    padding = 0, // amount of padding between the words (in pixels)
    rotate = 0, // a constant or function to rotate the words
    invalidation, // when this promise resolves, stop the simulation
  } = {},
) {
  const words =
    typeof text === "string" ? text.split(/\W+/g) : Array.from(text);

  const data = d3
    .rollups(words, size, (w) => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, maxWords)
    .map(([key, size]) => ({ text: word(key), size }));

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("font-family", fontFamily)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`);

  const cloud = d3Cloud()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .words(data)
    .padding(padding)
    .rotate(rotate)
    .font(fontFamily)
    .fontSize((d) => Math.sqrt(d.size) * fontScale)
    .on("word", ({ size, x, y, rotate, text }) => {
      g.append("text")
        .datum(text)
        .attr("font-size", size)
        .attr("fill", fill)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .text(text);
    });

  cloud.start();
  invalidation && invalidation.then(() => cloud.stop());
  return svg.node();
}
