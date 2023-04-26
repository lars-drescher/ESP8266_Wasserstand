import express from "express";
import PocketBase from "pocketbase";
import axios from "axios";
const pb = new PocketBase("http://127.0.0.1:8090");
const app = express();
const port = 3000;

const waterSensorIp = "http://192.168.4.1:80";

async function getData() {
  try {
    const response = await axios.get(waterSensorIp);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }

  //await saveData(response.)
}

async function saveData(waterLevel) {
  const data = {
    waterLevel: waterLevel,
    time: Date.now(),
  };

  const record = await pb.collection("waterLevels").create(data);
}

app.get("/", (req, res) => {
  getData();
  res.send("Hello World!");
});

app.get("/config", (req, res) => {
  getData();
  res.send("config");
});

// setInterval(getData(), 500);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
