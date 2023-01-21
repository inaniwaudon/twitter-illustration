import express from "express";
import path from "path";

const router = express.Router();

interface ImageRequest extends express.Request {
  query: {
    id: string;
    no: string;
  };
}

router.get("/image", (req: ImageRequest, res: express.Response) => {
  try {
    const filepath = path.join(
      __dirname,
      `../../images/${req.query.id}_${req.query.no}.jpeg`
    );
    res.sendFile(filepath);
  } catch (e) {
    console.log(e);
    res.status(500).send("IO error.");
  }
});

export default router;
