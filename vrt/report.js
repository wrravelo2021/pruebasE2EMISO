const compareImages = require("resemblejs/compareImages");
const config = require("./config.json");
const fs = require('fs');

let tool = '';
const PATH_3_3_0 = `screenshots/3.3.0`;
const PATH_3_42_5 = `screenshots/3.42.5`;
const PATH_COMPARISON = `screenshots/comparison`;
const SCENARIOS = ['F01', 'F05'];

async function generateResultImage(scenario, step) {
  if (!fs.existsSync(`../${tool}/${PATH_COMPARISON}/${scenario}`)){
    fs.mkdirSync(`../${tool}/${PATH_COMPARISON}/${scenario}`);
  }

  const { options } = config;
  const data = await compareImages(
    fs.readFileSync(`../${tool}/${PATH_3_3_0}/${scenario}/${step}.png`),
    fs.readFileSync(`../${tool}/${PATH_3_42_5}/${scenario}/${step}.png`),
    options
  );
  const results = {
      isSameDimensions: data.isSameDimensions,
      dimensionDifference: data.dimensionDifference,
      rawMisMatchPercentage: data.rawMisMatchPercentage,
      misMatchPercentage: data.misMatchPercentage,
      diffBounds: data.diffBounds,
      analysisTime: data.analysisTime,
  }
  fs.writeFileSync(`../${tool}/${PATH_COMPARISON}/${scenario}/${step}.png`, data.getBuffer());
  return results;
}

async function generateReport() {
  if (!fs.existsSync(`../${tool}/${PATH_COMPARISON}`)){
    fs.mkdirSync(`../${tool}/${PATH_COMPARISON}`);
  }
  
  let resultInfo = {}
  for (var i = 0; i < SCENARIOS.length; i++) {
    const numSteps = fs.readdirSync(`../${tool}/${PATH_3_3_0}/${SCENARIOS[i]}`).length;
    let scenarioInfo = {}

    for (var j = 0; j < numSteps; j++) {
      scenarioInfo[j+1] = await generateResultImage(SCENARIOS[i], j + 1);
    }
    resultInfo[SCENARIOS[i]] = scenarioInfo
  }

  fs.writeFileSync(`./report-${tool}.html`, createReport(SCENARIOS, resultInfo));
}

function scenario(s, info){
  const numSteps = fs.readdirSync(`../${tool}/${PATH_3_3_0}/${s}`).length;
  const steps = [...Array(numSteps).keys()];
  return `<div class=" scenario" id="test0">
  <div class=" btitle">
      <h2>Scenario: ${s}</h2>
  </div>
  <div id="visualizer">
    ${steps.map(st=>step(st + 1, s, info[st+1]))}
  </div>
</div>`
}

function step(s, scenario, info){
  return `
  <div class=" btitle">
    <h3>Step ${s}</h3>
  </div>
  <div class="imgline">
    <div class="imgcontainer">
      <span class="imgname">v. 3.3.0</span>
      <img class="img2" src="../${tool}/${PATH_3_3_0}/${scenario}/${s}.png" id="refImage" label="Reference">
    </div>
    <div class="imgcontainer">
      <span class="imgname">v. 3.42.5</span>
      <img class="img2" src="../${tool}/${PATH_3_42_5}/${scenario}/${s}.png" id="testImage" label="Test">
    </div>
  </div>
  <div class="imgline">
    <div class="datacontainer">
      <span class="imgname">Data</span>
      <p><b>Is Same Dimensions:</b> ${info['isSameDimensions']}</p></br>
      <p><b>Dimension Difference:</b> ${JSON.stringify(info['dimensionDifference'])}</p></br>
      <p><b>MisMatch Percentage:</b> ${info['misMatchPercentage']}</p></br>
      <p><b>Diff Bounds:</b> ${JSON.stringify(info['diffBounds'])}</p></br>
      <p><b>Analysis Time:</b> ${info['analysisTime']}</p></br>
    </div>
    <div class="imgcontainer">
      <span class="imgname">Diff</span>
      <img class="imgfull" src="../${tool}/${PATH_COMPARISON}/${scenario}/${s}.png" id="diffImage" label="Diff">
    </div>
  </div>`
}

function createReport(scenarios, resultInfo){
  return `
  <html>
      <head>
          <title> Ghost Report - ${tool}</title>
          <link href="index.css" type="text/css" rel="stylesheet">
      </head>
      <body>
          <h1>Report for 
               <a href="${config.url}"> ${config.url}</a>
              with ${tool[0].toUpperCase() + tool.slice(1)} 🎭
          </h1>
          <div id="visualizer">
              ${scenarios.map(s=>scenario(s, resultInfo[s]))}
          </div>
      </body>
  </html>`
}

async function main(){
  tool = 'playwright';
  console.log(`Running ${tool}`)
  await generateReport();
  tool = 'kraken'
  console.log(`Running ${tool}`)
  await generateReport();
}

main();
