const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homefile = fs.readFileSync("index.html","utf-8");
const replaceVal = (tempVal, OrgVal) => {
    let temperature = tempVal.replace("{%tempval%}", OrgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", OrgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", OrgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", OrgVal.name);
    temperature = temperature.replace("{%country%}", OrgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", OrgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req,res) => {
   if(req.url == "/"){
    requests("https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=04927ec59e888cbb8674de3aba900e9c")

    .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        //console.log(arrdata);
        const realTimeData = arrdata.map(val => replaceVal(homefile, val)).join("");
        res.write(realTimeData) ;
    })

        
        //console.log(realTimeData)

    
    
    .on("end", (err) => {
        if(err) return console.log("connection closed",err);
        res.end();
      }); 
    }
});

server.listen(9000, "127.0.0.1");