import express from "express";
import PocketBase from "pocketbase";
import schedule from "node-schedule";
import * as dotenv from "dotenv";

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
let data = [];

async function getData() {
  if (devMode) {
    const randomNumber = Math.floor(Math.random() * 100);
    const randomData = {
      waterLevel: randomNumber,
      timeStamp: Date.now(),
    };

    data.push(randomData);
    console.log(data);
    await pb.collection("waterLevels").create(randomData);
    return;
  }

  try {
    const response = await fetch(waterSensorIp);
    const resJson = await response.json();
    const data = {
      waterLevel: resJson.waterLevel,
      timeStamp: Date.now(),
    };

    data.push(data);

    await pb.collection("waterLevels").create(data);

    return;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Standart Route
 */
app.get("/", async (req, res) => {
  res.render("main", { data: data });
});

app.get("/newdata/", async (req, res) => {
  const timeStamp = req.query.timestamp;

  if (!timeStamp) res.status(200).send(data);
});

/**
 * Führt einen Cron Job, der die Daten speichert in regelmäßigen Abständen aus
 */
const job = schedule.scheduleJob("*/5 * * * * *", async function () {
  getData().catch((e) => {
    console.log("Error Saving Data");
  });
});

/**
 * Initialisierung vom Web Server
 */
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
