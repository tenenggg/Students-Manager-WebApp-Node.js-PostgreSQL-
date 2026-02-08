const { Router } = require("express");                              // using router to create a router which is a method of express
const controller = require("./controller/studentscontroller");     // importing controller for students from studentscontroller.js file located in controller folder




const router = Router();                                            // creating router variable or object so that we can use it in other files



router.get("/", controller.getStudents);                    // from server.js to here and will be using the controller.getStudents() method where we imported from controller
router.get("/:id", controller.getStudentById);              // from server.js to here and will be using the controller.getStudentById() method where we imported from controller
router.post("/", controller.addStudents);                   // from server.js to here and will be using the controller.addStudent() method where we imported from controller
router.delete("/:id", controller.deleteStudentById);         // delete method to delete a student by id
router.put("/:id", controller.updateStudentById);        // update method to update a student by id


module.exports = router;                                         // exporting router to be used in other files so that server.js can use it