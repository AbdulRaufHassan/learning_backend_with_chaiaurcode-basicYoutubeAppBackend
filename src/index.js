import { app } from "./app.js";
import { env } from "./constants.js";
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

// app.get("/api/students", (req, res) => {
//   const students = [
//     { id: 1, name: "John", age: 18 },
//     { id: 2, name: "Jane", age: 15 },
//     { id: 3, name: "Bob", age: 20 },
//   ];
//   res.json(students);
// });
