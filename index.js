const http = require('http');
const fs = require('fs');
const requests = require('requests');
const port = process.env.PORT || 8000;

const homefile = fs.readFileSync("home.html", "utf-8");
//const cssfile = fs.readFileSync("styles.css", "utf-8");

const replaceVal = (tempVal, orival) => {
    //const temp = (orival.main.temp - 273.15).toFixed(2);
    let temperature = tempVal.replace("{%tempval%}", (orival.main.temp - 273.15).toFixed(2));
    temperature = temperature.replace("{%mintempval%}", (orival.main.temp_min - 273.15).toFixed(2));
    temperature = temperature.replace("{%maxtempval%}", (orival.main.temp_max - 273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", orival.name);
    temperature = temperature.replace("{country%}", orival.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orival.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Gujarat&appid=d888693bfcca3370fefd2ef5dfc5e699")
            .on("data", (chunk) => {
                const obj = JSON.parse(chunk);
                const arrdata = [obj];
                //console.log(arrdata[0].main.temp);
                const realtimedata = arrdata.map((val) => replaceVal(homefile, val)).join("");
                res.write(realtimedata);

            })
            .on("end", (err) => {
                if (err) return console.log('connection closed due to errors', err);

                console.log("end");
                res.end();
            });
    }

});

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})