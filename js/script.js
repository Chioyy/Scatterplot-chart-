d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(error, a) {
    var dataset = [a.map(b => b.Year),a.map(b => b.Seconds)];

    const w = 700,
          h = 500,
          padding = 40,
          margin = 20;
  
    var bestTime = a[0]["Seconds"];
    var worstTime = a[a.length - 1]["Seconds"];

    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset[0]) - 1, d3.max(dataset[0]) + 1])
                     .range([0, w - padding - margin]);

    const yScale = d3.scaleTime()
                     .domain([new Date(worstTime * 1000 + 10000), new Date(bestTime * 1000 - 5000)])
                     .range([h - padding, padding + margin]);
  
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
    
    var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .attr("id", "tooltip")
                    .style("opacity",0)
  
    function tooltipContent(d){
        const doping = d.Doping === "" ? "No allegations" : d.Doping
        return "<strong>" + d.Name + "</strong>" + "<br>" + d.Nationality + "<br><br>" +
          "Year: " + d.Year + " Time: " + d.Time + "<br><br>" + doping
    }
    
    svg.selectAll("circle")
        .data(a)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.Year) + padding + margin)
        .attr("cy", (d) => yScale(new Date(d["Seconds"] * 1000)) + margin)
        .attr("r", (d) => 5)
        .attr("class", "dot")
        .attr("data-xvalue",(d,i) => d.Year)
        .attr("data-yvalue",(d,i) => new Date(d["Seconds"] * 1000))
        .attr("fill", (d) => { 
            if (d.Doping === "") {
                return "#3c7df8";
            }
            else {
            return "#e8302d";
            }})
        .on("mouseover",function(d, i) {
            const text = tooltipContent(d)
            tooltip.transition().style("opacity",0.9)
            tooltip.html(text)
                   .style("display", "inline")
                   .style("top", (d3.event.pageY - 28) + "px")
                   .style("left", (d3.event.pageX / 4) + "px")
            d3.select(this)
                   .style("r",10)
        })
        .on("mouseout",function(d,i){
            tooltip.transition()
                   .style("opacity",0)
                 d3.select(this)
                   .style("r",5)
        })
  
    svg.append("text")
        .text("Doping in Professional Bicycle Racing")
        .attr("class", "title")
        .attr("x", w / 2 - 200)
        .attr("y", 20)
        .attr("font-size", 25)
  
    svg.append("text")
        .text("35 Fastest times up Alpe d'Huez (1995 - 2015)")
        .attr("class", "title2")
        .attr("x", w / 2 - 160)
        .attr("y", 50)
        .attr("font-size", 18)

    svg.append("text")
        .text("Time (minutes:seconds)")
        .attr("class", "yaxisname")
        .attr("x", 0)
        .attr("y", 230)
        .attr("font-size", 16)
        .attr("transform", "translate(-215,300)rotate(-90)")
  
    svg.append("text")
        .text("Year")
        .attr("class", "xaxisname")
        .attr("x", w - 30)
        .attr("y", h - 25)

    svg.append("g")
        .attr("id", "x-axis")
        .attr("class", "tick")
        .attr("transform", "translate(" + (padding + margin) + "," + (h - padding + margin) + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format(".0f")))
  
    svg.append("g")
        .attr("id", "y-axis")
        .attr("class", "tick")
        .attr("transform", "translate(" + (padding + margin) + "," + margin + ")")
        .call(d3.axisLeft(yScale).ticks(20).tickFormat(d3.timeFormat("%M:%S")));
  
    var legend = svg.append("g")
                    .attr("id", "legend");
  
    legend.append("circle")
          .attr("cx", w - 135)
          .attr("cy", h - 405)
          .attr("r", 5)
          .attr("fill", "#3c7df8");
  
    legend.append("circle")
          .attr("cx", w - 135)
          .attr("cy", h - 380)
          .attr("r", 5)
          .attr("fill", "#e8302d");
  
    legend.append("text")
          .attr("x", w - 125)
          .attr("y", h - 400)
          .text("Clean riders");
  
    legend.append("text")
          .attr("x", w - 125)
          .attr("y", h - 375)
          .text("Riders with doping");
  
    legend.append("text")
          .attr("x", w - 125)
          .attr("y", h - 355)
          .text("allegations");  
});