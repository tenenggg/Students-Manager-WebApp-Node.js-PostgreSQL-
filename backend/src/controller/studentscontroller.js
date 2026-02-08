const pool = require("../config/db")                                        //  importing pool from db.js, to get the connection to the database 
const queries = require("../model/studentmodel")                           // importing queries from studentmodel.js file located in model folder





// beginning of the controller functions that will use the queries( which will call model) to get the data from the database


const getStudents = (req, res) => {                                       // to get all the students from the database
    
    pool.query(queries.getStudents, (error, result) => {                  //  using pool.query to get the data from the database, query also ahve 2 parameters, 1st is the query and 2nd is the callback function
        if (error) throw error;                                           // if error throw error 
        res.status(200).json(result.rows);                                  // if no error return the result
    });
};

const getStudentById = (req, res) => {                                      // to get a student by id from the database
    const ID = parseInt(req.params.id);                                     // converting the id to integer 
    
    pool.query(queries.getStudentById, [ID], (error, result) => {           // using the query to get the data from the database, query also ahve 2 parameters, 1st is the query and 2nd is the callback function
        if (error) throw error;                                           // if error throw error 
        res.status(200).json(result.rows);                                  // if no error return the result

    });
};


const addStudents = (req ,res) => {                                         // to add a student to the database               
    const { name, email, age, dob } = req.body;                                          // destructuring the data from the request body
    
    pool.query(queries.checkEmailExists, [email], (error, result) => {                   // check if the email already exists
        if (result.rows.length) {                                                       // if email already exists           
            return res.status(400).send("Email already exists");                                   
        }

        pool.query(queries.addStudents,[name, email, age, dob], (error, result) => {          // if email does not exist, then add the student
            if (error) throw error;
            res.status(201).send("Student added successfully");
            console.log("Student added successfully");
        })
    });
};


const deleteStudentById = (req, res) => {                                   // to delete a student by id from the database      
    const ID = parseInt(req.params.id);                                              // converting the id to integer
    
    pool.query(queries.getStudentById, [ID], (error, result) => {                    // using the query to delete the data from the database, query also ahve 2 parameters, 1st is the query and 2nd is the callback function
        const noStudentFound = !result.rows.length;                                     // checking if no student found with the given id
        if (noStudentFound) {                                                           // if no student found
            return res.status(404).send("Student does not exist in the database");               
        }

        pool.query(queries.deleteStudentById, [ID], (error, result) => {             // if student found, then delete the student
            if (error) throw error;
            res.status(200).send("Student deleted successfully");
        })
        
    });
};




const updateStudentById = (req, res) => {                                // to update a student by id in the database   
    const ID = parseInt(req.params.id);                                             // converting the id to integer             
    const { name, email, age, dob } = req.body;
   
    pool.query(queries.getStudentById, [ID], (error, result) => {                 // using the query to update the data from the database, query also ahve 2 parameters, 1st is the query and 2nd is the callback function
        const noStudentFound = !result.rows.length;                                     // checking if no student found with the given id
        if (noStudentFound) {                                                                // if no student found
            return res.status(404).send("Student does not exist in the database");
        }

        pool.query(queries.updateStudentById, [name, email, age, dob, ID], (error, result) => {             // if student found, then update the student
            if (error) throw error;                                                     
            res.status(200).send("Student updated successfully");
        })

    });

};


 


// the moment the controller is calling model query to run the function is when "queries.getStudents" , "queries.getStudentById", "queries.addStudents", "queries.deleteStudentById", "queries.updateStudentById"  is used



module.exports = {                                                                // exporting all the controller functions to be used in other files, so the route.js can use it

    getStudents,
    getStudentById,
    addStudents,
    deleteStudentById,
    updateStudentById,
    

};