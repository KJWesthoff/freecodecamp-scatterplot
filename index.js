//fetch data
console.log("Index js running")


const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json" 


fetchData = async () => {
  // do the fetching  
  const response = await fetch(dataUrl)
  const data = await response.json()
    
  
  // iso Dateify timedata in the dataset

  data.map(d => {
    d.TimeParsed = new Date(1975, 0, 1, 0,d.Time.split(":")[0], d.Time.split(":")[1])
    d.Year = Number(d.Year)
  })
  console.log("data: ", data)


  // get the bounds of the data
  const maxY = data.reduce((prev, curr) => prev['TimeParsed'] > curr['TimeParsed'] ? prev : curr)['TimeParsed']
  const minY = data.reduce((prev, curr) => prev['TimeParsed'] < curr['TimeParsed'] ? prev : curr)['TimeParsed']
  
  const maxX = data.reduce((prev, curr) => prev['Year'] > curr['Year'] ? prev : curr)['Year']
  const minX = data.reduce((prev, curr) => prev['Year'] < curr['Year'] ? prev : curr)['Year']
  

  console.log(maxY, minY, minX, maxX)


  yR = (maxY-minY)*0.05
  xR = (maxX-minX)*0.05
  // main chart
  const w = 1000
  const h = 600
  const padding = 60
  
  const svg = d3.select(".chart")
              .append("svg")
              .attr("height", h)
              .attr("width",w)
              .style("background-color", "aquamarine")             
  

  
  // X axis scaling
  var xScale = d3.scaleLinear()
  .domain([minX-xR,maxX])
  .range([padding, w-padding]);


  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#000")
    .style("color","pink")
    .text("d['Year]")
    .attr("id", "tooltip")
  
  
  // Define X-axis
  const xAxis = d3.axisBottom()
  .scale(xScale)
  .ticks(15)
  .tickFormat((t) => `${t}` )
  svg.append("g")
   .attr("transform", "translate(" + 0 + "," + (h-padding) + ")")
   .attr('id', 'x-axis')
   .call(xAxis);
  

var yScale = d3.scaleTime()  
  .domain([maxY, minY-yR])
  .range([h-padding, padding]);       
  
const yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(20)
  .tickFormat(d3.timeFormat('%M:%S'))

  svg.append("g")
    .attr("transform", "translate(" + padding + "," + 0 + ")")
    .attr('id', 'y-axis')
    .call(yAxis);
  
  
  // plot dots
  svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", d => xScale(d['Year'])) 
    .attr("cy", d => yScale(d.TimeParsed))
    .attr("r", 6)
    .attr("fill", "blue")
    .attr("class", "dot")
    .attr("data-xvalue", d=>d['Year'])
    .attr("data-yvalue", d=>d.TimeParsed)
    .on("mouseover", (e,d) => {return tooltip.style("visibility", "visible");})
    .on("mousemove", (e,d) => {
      return tooltip
              .style("top", (e.pageY-10)+"px")
              .style("left",(e.pageX+10)+"px")
              .attr("data-year", d['Year'])
              .text(d['Name'] +" , "+ d['Year'])
    
    })
    .on("mouseout", (e,d) => {return tooltip.style("visibility", "hidden");});

    
  
  // add a legend 
  var posX = 800
  var posY = 100
  var legendTxt = svg.append('text')
  .attr("id", "legend")
  .attr("x", posX+20)
  .attr("y", posY)
  .text("Riders going up");

  svg.selectAll("circle")
  var legendDot = svg.append('circle')
  .attr('cx', posX)
  .attr('cy', posY)
  .attr('r', 8)
  .attr("class", "legend_dot")
  .attr("fill", "blue");
  



}




fetchData()


