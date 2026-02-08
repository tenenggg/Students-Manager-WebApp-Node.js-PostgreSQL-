const getStudents = "SELECT * FROM students";                                                 // query to get all students
const getStudentById = 'SELECT * FROM students WHERE "ID" = $1';                                // query to get a student by id       
const checkEmailExists = 'SELECT s FROM students s WHERE s.email = $1';                          // query to check if email already exists
const addStudents = 'INSERT INTO students (name, email, age, dob) VALUES ($1, $2, $3, $4)';   // query to add a student
const deleteStudentById = 'DELETE FROM students WHERE "ID" = $1';                                // query to delete a student by id
const updateStudentById = 'UPDATE students SET name = $1, email = $2, age = $3, dob = $4 WHERE "ID" = $5';                       // query to update a student by id




module.exports = {                                                                  // exporting all the queries to be used in other files, so that controller can use these queries
    getStudents,
    getStudentById,
    checkEmailExists,
    addStudents,
    deleteStudentById,
    updateStudentById,
};

    