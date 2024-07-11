import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log(`server listening on port 3000`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database:==============", err);
  });

