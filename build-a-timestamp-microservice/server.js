import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));

function sendTimestamp(req, res) {
  const raw = req.params.date;
  const date = raw === undefined
    ? new Date()
    : new Date(/^\d+$/.test(raw) ? Number(raw) : raw);
  if (Number.isNaN(date.getTime())) return res.json({ error: "Invalid Date" });
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
}

app.get("/api", sendTimestamp);
app.get("/api/:date", sendTimestamp);

const PORT = 8000;
app.listen(PORT, () => console.log("Your app is listening on port " + PORT));