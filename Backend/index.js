import express from "express";
import PocketBase from "pocketbase";
import schedule from "node-schedule";
import * as dotenv from "dotenv";
import { appendFileSync } from "fs";

const pb = new PocketBase("http://127.0.0.1:8090");
const app = express();
app.set("view engine", "ejs");

dotenv.config();

const devMode = process.env.DEV_MODE;
const port = process.env.PORT || 4040;
const waterSensorIp = process.env.SENSOR_IP;

/**
 * Array mit Objekten
 */
let dataArray = [];

function saveCsv(time, value) {
  const csv = `${time},${value}\n`;
  try {
    appendFileSync("./log.csv", csv);
  } catch (err) {
    console.error(err);
  }
}

async function getData() {
  const data = {
    waterLevel: 0,
    timeStamp: Date.now(),
  };

  if (devMode) {
    const randomNumber = Math.floor(Math.random() * 100);
    data.waterLevel = randomNumber;
  } else {
    try {
      const response = await fetch(waterSensorIp);
      const resJson = await response.json();
      data.waterLevel = resJson.waterLevel;
    } catch (e) {
      console.error(e);
    }
  }

  // Save Data
  console.log(data);
  dataArray.push(data);
  saveCsv(data.timeStamp, data.waterLevel);
  //await pb.collection("waterLevels").create(data);
}

/**
 * Standart Route
 */
app.get("/", async (req, res) => {
  res.render("main");
});

app.get("/newdata/", async (req, res) => {
  const timeStamp = req.query.timestamp;

  if (!timeStamp) return res.status(200).send(dataArray);

  const arrayStartsAt = dataArray.findIndex(
    (data) => data.timeStamp >= timeStamp
  );

  const newArray = dataArray.slice(arrayStartsAt + 1);
  return res.status(200).send(newArray);
});

/**
 * Führt einen Cron Job, der die Daten speichert in regelmäßigen Abständen aus
 */
const job = schedule.scheduleJob("*/2 * * * * *", async function () {
  getData().catch((e) => {
    console.log("Error Saving Data", e);
  });
});

/**
 * Initialisierung vom Web Server
 */
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
