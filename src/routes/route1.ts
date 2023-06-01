import express, { Request, Response, NextFunction } from "express";
import fs from "fs";

const router = express.Router();
const dataQueue: string[] = [];
let consecutiveHitsRoute1 = 0;
let consecutiveHitsRoute2 = 0;

function processQueue(filePath: string, route: number) {
  console.log("dataQueue",dataQueue)
  while (dataQueue.length > 0) {
    const route1Data = dataQueue.splice(0,1);
    fs.appendFileSync(filePath, route1Data + "\n");

    if (dataQueue.length > 0) {
      const route2Data = dataQueue.splice(dataQueue.length - 1,1);
      fs.appendFileSync(filePath, route2Data + "\n");
    }
  }
  
  // if (route === 1) {
  //   consecutiveHitsRoute1 = 0;
  //   if (consecutiveHitsRoute2 === 0 && dataQueue.length > 0) {
  //     processQueue(filePath, 2);
  //   }
  // } else if (route === 2) {
  //   consecutiveHitsRoute2 = 0;
  //   if (consecutiveHitsRoute1 === 0 && dataQueue.length > 0) {
  //     processQueue(filePath, 1);
  //   }
  // }
}

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const filePath = "C:/Users/supri/OneDrive/Desktop/mobigic_server/uploads/text.txt";
    console.log("req.baseUrl",req.baseUrl,"id",id)
    if (req.baseUrl === "/api/route1") {
      dataQueue.push(id);
      consecutiveHitsRoute1++;
     console.log("consecutiveHitsRoute1",consecutiveHitsRoute1)
      if (consecutiveHitsRoute2 > 0) {
        processQueue(filePath, 1);
        consecutiveHitsRoute1 = 1;
        consecutiveHitsRoute2 = 0;
      }
    } else if (req.baseUrl === "/api/route2") {
      dataQueue.push(id);
      consecutiveHitsRoute2++;
      console.log("consecutiveHitsRoute2",consecutiveHitsRoute2)
      if (consecutiveHitsRoute1 > 0) {
        processQueue(filePath, 2);
        consecutiveHitsRoute2 = 1;
        consecutiveHitsRoute1 = 0
      }
    }

    res.status(200).json({
      message: "Data appended consecutively",
      id,
    });
  } catch (err) {
    next(err);
  }
});


export default router;