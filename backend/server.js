require("dotenv").config();                                              // using dotenv to access the env data                  
const express = require("express")                                      // using framework express to create a server
const studentRoutes = require("./src/route");                           // importing routes for students table from route.js
const cors = require("cors");                                         // using cors to allow cross origin requests ( frontend and backend running on different ports )

const app = express();                                                  // assigning express to app
const port = process.env.PORT || 3000;                                  // assigning port to env data or 3000 if not found

app.use(cors());                                                     // using cors to allow cross origin requests ( frontend and backend running on different ports )             
app.use(express.json());                                                // using middleware to parse the json data, convert the json data to js object so that we can use it in our code





// students table routes, the beginning of the route is /api/students

app.use("/api/students", studentRoutes);                                 // using router to create a router which is a method of express
app.listen(port, () => console.log(`Server is running on port ${port}`));           // listen method is used to start the server