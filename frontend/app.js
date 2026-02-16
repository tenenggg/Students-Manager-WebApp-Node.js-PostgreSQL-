const ENDPOINT = `http://localhost:3000/api/students`; // API base URL


// assigning tags to variables using DOM ids
const studentsBody = document.getElementById("studentsBody"); // table body
const searchInput = document.getElementById("searchInput"); // search box
const sortSelect = document.getElementById("sortSelect"); // sort dropdown
const refreshBtn = document.getElementById("refreshBtn"); // reload button
const resetBtn = document.getElementById("resetBtn"); // clear form button
const studentForm = document.getElementById("studentForm"); // form element
const formTitle = document.getElementById("formTitle"); // form header
const submitBtn = document.getElementById("submitBtn"); // submit button
const studentIdInput = document.getElementById("studentId"); // hidden id field
const nameInput = document.getElementById("nameInput"); // name input
const emailInput = document.getElementById("emailInput"); // email input
const ageInput = document.getElementById("ageInput"); // age input
const dobInput = document.getElementById("dobInput"); // date input
const selectedStudent = document.getElementById("selectedStudent"); // details panel
const toast = document.getElementById("toast"); // toast container
const statTotal = document.getElementById("statTotal"); // stats: total
const statAvgAge = document.getElementById("statAvgAge"); // stats: average age
const statNewest = document.getElementById("statNewest"); // stats: newest

let students = []; // in-memory list from API, meaning data stored temporarily in this variable, not in database, if it doesnt exist in this variable, we cant show it on UI, there will be more of this if we add more features and tables
let activeStudent = null; // currently edited student,if not editing, it is null, if editing, it holds the student object

const toId = (student) => student.ID ?? student.id ?? student.Id; // normalize id keys, because we have inconsistent casing in backend, some are 'ID', some are 'id'


// sometimes we use .value, .textContent, the difference is that .value is used for form inputs, while .textContent is used for displaying text content, and .innerHTML is used to display HTML content, and .outerHTML is used to display HTML content including the element itself








const showToast = (message, isError = false) => {           // temporary UI message, pass message and isError flag, so the arguments will be message string and boolean( true or false depending on whether it's an error or not)
    toast.textContent = message;                            // change the text content of the toast element to the message passed, like innerHTML but safer for plain text
    toast.style.background = isError ? "#991b1b" : "#111827";  // red for errors, dark gray for normal(like student added)
    toast.classList.add("show");                                    // add the "show" to toast class to make it visible, classList is used to manipulate classes of an element, 
    window.clearTimeout(toast.hideTimer);                           // clear any existing hide timer, so if multiple toasts are shown quickly, they don't interfere with each other
    toast.hideTimer = window.setTimeout(() => {             // set a new timer and store its id in toast.hideTimer property 
        toast.classList.remove("show");                     // after 2400 milliseconds (2.4 seconds), remove the "show" class to hide the toast and make it disappear from UI
    }, 2400);
};
// this is an expression function, and timer is a callback function









const fetchStudents = async () => {          // GET all students by using fetch API, async function and error handling with try-catch
    try {                                       // error handling block starts here
        const res = await fetch(ENDPOINT);
        if (!res.ok) {                        // if response is not ok (status code not in 200-299 range)  
            throw new Error(await res.text());  // throw an error with the response text as message
        }
        const data = await res.json();              // convert the response to JSON(so that javascript can understand it) and store it in data variable
        students = Array.isArray(data) ? data : []; // ensure students is always an array, if data is not an array, set students to empty array
        renderStudents();                           // render the table with the new data
        updateStats();                              // update the stats cards   
    } catch (error) {
        showToast(error.message || "Failed to load students", true);  // show error toast with message or default text
    }
};
// this is an async function with error handling, and it is a callback function for the refresh button









const updateStats = () => {                 // update summary cards, like total students, average age, newest student
    statTotal.textContent = students.length;    // assign total number of students to statTotal element
    if (!students.length) {                    // if no students retrieve, show dash in cards(means empty)
        statAvgAge.textContent = "-";
        statNewest.textContent = "-";
        return;
    }

    const ages = students.map((student) =>                  // it use map and filter method
        Number(student.age)).filter((age) =>                // first to make sure its a number and then to make sure its not NaN
            !Number.isNaN(age));
    const avgAge = ages.length ?                            // if ages array is true(not empty), calculate the average age, if not show dash
        Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : "-";
    statAvgAge.textContent = avgAge;                        // assign average age to statAvgAge element

    const newest = students[students.length - 1];           // get the last student from the students array
    statNewest.textContent = newest?.name ?? "-";           // assign newest student name to statNewest element

    // btw map is an array method to go through each element of an array and do something with it, and it doesnt change the original array, it returns a new array with the results
    // same as filter, reduce, forEach, etc, they all dont change the original array, they return a new array with the results, so u assign the result to a new variable
    // u can also use other method like use loop, but map is more concise and readable 

    // the reason we need both map and filter is to make sure the age is a number and then to make sure its not NaN, if we dont use map 
    // the age will be a string and then we cant do the math, if we dont use filter, the age will be NaN and then we cant do the math

    // math.round is used to round the average age to the nearest whole number
    // reduce is used to sum up all the ages, and then divide by the number of ages to get the average age
    // a and b get from the ages array, and 0 is the initial value of a

    // ?? is nullish coalescing operator, ? : is ternary operator, and ?. is optional chaining operator
    // ?? is used to check if the property is null or undefined, if not it returns the value                                              (condition) ?? (if null or undefined do this, if not return the value)
    // ? : is to check if the property is null or undefined, if it is, it returns the right side                                          (condition) ? (true do this) : (false, or  do this)
    // ?. is used to check if the property is null or undefined, if its not, access the property                                          (condition) ?. (if not null or undefined, access the property) , the ?. must be followed by a "." which is a property accessor

    // in code above it first check newest null or undefined, if not it returns newest.name 
    // and second it checks if the newest.name is null or undefined, if not it returns newest.name, if it is, it returns a dash

    // The Ternary Operator (? :) acts as a concise shortcut for if-else statements
    // The Nullish Coalescing Operator (??) provides a defensive coding mechanism similar to error handling, just to check null or undefined before proceeding
    // The Optional Chaining Operator (?.) provides a defensive coding mechanism similar to error handling but involves accessing properties of an object, check if the object is null or undefined before accessing its properties
};










const formatDate = (value) => { // safe date formatting function
    if (!value) return "-";             // if value is null or undefined, if it is not return a dash

    const date = new Date(value);       // create a new Date object from the value

    if (Number.isNaN(date.getTime())) return value;  // check if the date is valid, if it is not , return value

    return date.toLocaleDateString();   // return the date in a readable format (e.g., "12/31/2022")
};

// this function ensures we don't crash or show weird text if the date is missing or invalid
// first it create new Date object and assign to date
// and then call the method getTime() to get the time at that date
// and check the time is valid or not(isNaN), if not return the original value
// finally it convert the date to the user's local date format (MM/DD/YYYY in US, DD/MM/YYYY in UK, etc.) by using toLocaleDateString()













const renderStudents = () => {                  // render table from state to the UI, this function is called when the page loads and when the user searches or sorts the students, and also will overide the previous table
    const query = searchInput.value.trim().toLowerCase(); // get searchInput element from DOM and get its value(what user typed), trim whitespace, and convert to lowercase for case-insensitive search
    const sorted = [...students];       // ... spread the array into single elements, and [] wrap it into a new array

    switch (sortSelect.value) {
        case "name-desc":
            sorted.sort((a, b) =>
                (b.name || "").localeCompare(a.name || "")); // sort names Z-A
            break;
        case "age-asc":
            sorted.sort((a, b) =>
                Number(a.age || 0) - Number(b.age || 0)); // sort age Low-High (ascending)
            break;
        case "age-desc":
            sorted.sort((a, b) =>
                Number(b.age || 0) - Number(a.age || 0)); // sort age High-Low (descending)
            break;
        default:
            sorted.sort((a, b) =>
                (a.name || "").localeCompare(b.name || "")); // default sort: Name A-Z
            break;
    }
    // trim is a string method to remove whitespace from the start and end of a string
    // we use [...students] because if we use students.sort(), it will mutate the original array
    // localeCompare is a string method to compare strings in alphabetical order, handling accents and helper cases, It returns a negative number if the first string comes before the second, positive if after, and 0 if they're equal
    // so if b.name comes before a.name, it returns a negative number, and if a.name comes before b.name, therefore it will sort the array in descending order
    // for numbers we just subtract them: a - b for ascending, b - a for descending
    // the case is directly from html under the sortSelect, because we run sortSelect.value


    const filtered = sorted.filter((student) => { // client-side search using filter method, to only show students that match the query
        if (!query) return true; // if search box is empty(no query or false), show all students, if not proceed to the next line
        return (
            (student.name || "").toLowerCase().includes(query) || // check if name contains the query(what user typed), also make it lowercase for case-insensitive search
            (student.email || "").toLowerCase().includes(query)   // OR check if email contains the query(what user typed), also make it lowercase for case-insensitive search
        );
    });
    // why we use 'include' instead of '==' or '===' because its more flexible, and practical, as u dont need to type the exact name or email, u can type the first letter or any letter and it will show the result


    if (!filtered.length) { // if no students match the filter, means the array is empty
        studentsBody.innerHTML = '<tr><td class="empty" colspan="5">No students found.</td></tr>'; // show "No result" message in the table
        return;
    }

    studentsBody.innerHTML = filtered // build rows for the table, override the previous table, also all the operation below is after the filtering and sorting
        .map((student) => {           // map transforms each student object into an HTML string (a table row <tr>)
            const id = toId(student); // normalize the ID, using toId() function
            return `
                <tr data-id="${id}">
                    <td>${student.name ?? "-"}</td>
                    <td>${student.email ?? "-"}</td>
                    <td>${student.age ?? "-"}</td>
                    <td>${formatDate(student.dob)}</td>
                    <td class="table-actions">
                        <button class="btn-link" data-action="select">View</button>                                 
                        <button class="btn-link" data-action="edit">Edit</button>
                        <button class="btn-link btn-danger" data-action="delete">Delete</button>
                    </td>
                </tr>                                   
            `;                                                              // this is 1 row of the table, and it will be repeated for each student in the filtered array
        })
        .join("");

    // join the array of HTML strings into one single long string to put into innerHTML, because innerHTML can only take a string, not an array, and the same as map
    // map returns an array like ["<tr>...</tr>", "<tr>...</tr>"], so .join("") squashes them into "<tr>...</tr><tr>...</tr>"
    // innerHTML parses that string and turns it into real DOM elements on the page

    // the buttons doesnt exist in html, it is created dynamically here, so it will only appear when renderStudents() is called
    // and the event listener is attached to the studentsBody, which is the parent container of the buttons
    // so when the buttons are created, the event listener will automatically be attached to them
    // this is called event delegation
};













const setFormState = (student) => { // switch between add/edit mode for the form
    if (!student) {                     // if no student is passed, we are in "Add Mode"
        activeStudent = null;           // clear the active student variable
        formTitle.textContent = "Add Student"; // update title
        submitBtn.textContent = "Add Student"; // update button text
        studentForm.reset();            // clear all form inputs, reset() is a method that resets all form fields to their initial values
        studentIdInput.value = "";      // clear hidden ID
        return;                         // exit the function, if there is no return statement, the code will continue to the next line
    }

    // if a student IS passed, we are in "Edit Mode"
    activeStudent = student;            // store which student we are editing
    formTitle.textContent = "Edit Student"; // update title
    submitBtn.textContent = "Update Student"; // update button text

    // pre-fill the form inputs with the student's current data
    studentIdInput.value = toId(student) ?? "";                                 // nullish coalescing operator ?? for defensive coding
    nameInput.value = student.name ?? "";
    emailInput.value = student.email ?? "";
    ageInput.value = student.age ?? "";
    dobInput.value = student.dob ? String(student.dob).slice(0, 10) : ""; // slice to get YYYY-MM-DD for date input, and ternary operator is used to check if the date is valid, if not, it will return an empty string
};
// this function reuses the same HTML form for both creating and updating
// helpful to avoid duplicating HTML code

// .reset() is a built-in method to clear form fields
// slice is used to extract a portion of a string, in this case, the first 10 characters of the date string (YYYY-MM-DD)
// why we use 'String(student.dob).slice(0, 10)' is because the date is stored as a string in the database, and we need to convert it to a string by using String() constructor, and then we can use slice() method











const setSelectedStudent = (student) => { // show details in side panel under the form (View Student)
    if (!student) {
        selectedStudent.innerHTML = "<p>Select a student to view details.</p>"; // default message if the student is empty
        return;                                                                 // again, return to exit the function because there is no else block
    }

    // if student exists, inject their details HTML into the side panel, by using innerHTML 
    selectedStudent.innerHTML = `
        <p><span class="badge">${student.name ?? "-"}</span></p>
        <p><strong>Email:</strong> ${student.email ?? "-"}</p>
        <p><strong>Age:</strong> ${student.age ?? "-"}</p>
        <p><strong>Date of Birth:</strong> ${formatDate(student.dob)}</p>
    `;
};
// innerHTML is used again to dynamically update the content of the div based on selection










const createStudent = async () => { // POST request to create a new student by using fetch API, async function and error handling with try-catch
    const payload = {                   // gather data from form inputs into an object
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: Number(ageInput.value),    // ensure age is a number
        dob: dobInput.value,
    };
    // we create object called payload and assign its properties to the values of the form inputs
    // the payload properties must match the server's expected properties
    // if the payload properties do not match the server's expected properties, the server will not be able to process the request
    // if the payload properties are not in the correct order, the server will not be able to process the request
    // these properties is then sent to the server by using fetch API

    try {
        const res = await fetch(ENDPOINT, {     // fetch() defaults to GET, so we must specify options
            method: "POST",                     // HTTP method for creating data
            headers: { "Content-Type": "application/json" }, // tell server we are sending JSON data
            body: JSON.stringify(payload),      // convert JS object to JSON string because HTTP sends text, and also sending the (payload) to the server
        });

        if (!res.ok) {                          // checks if status code is 200-299
            throw new Error(await res.text());  // if not, throw error with server's message
        }

        showToast("Student added");     // show success message by calling showToast function
        await fetchStudents();          // refresh the list to show the new student immediately by calling fetchStudents function
        setFormState(null);             // reset the form to "Add Mode" and clear inputs by calling setFormState function

    } catch (error) {
        showToast(error.message || "Failed to add student", true); // show error message if error occurs
    }
};
// this is an async function with error handling, that is used to create a new student, by sending a POST request to the server(nodejs)
// trim() is used to remove whitespace from both ends of a string, we use it to prevent the user from entering empty strings
// JSON.stringify() is the opposite of JSON.parse() - it turns object into str/ing for transport
// we dont need to use res.json() here because the server is not sending back JSON data, it is sending back a success message, not an array of students like in fetchStudents()










const updateStudent = async (id) => { // PUT request to update existing student by ID
    const payload = {                       // gather updated data from form
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: Number(ageInput.value),
        dob: dobInput.value,
    };

    try {
        const res = await fetch(`${ENDPOINT}/${id}`, { // append ID to URL so server knows WHO to update, also use template literals to append the ID to the URL
            method: "PUT",                             // HTTP method for updating/replacing data
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        showToast("Student updated");   // success!
        await fetchStudents();          // refersh list
        setFormState(null);             // reset form to default state
    } catch (error) {
        showToast(error.message || "Failed to update student", true);
    }
};
// almost identical to createStudent, but uses PUT and includes the ID in the URL, since we need to specify which student to update












const deleteStudent = async (id) => { // DELETE request to remove student
    if (!id) return;

    // window.confirm creates a browser popup asking Yes/No
    // pauses code execution until user clicks a button
    const confirmed = window.confirm("Delete this student?");
    if (!confirmed) return; // if user cancelled, stop here

    try {
        const res = await fetch(`${ENDPOINT}/${id}`, { method: "DELETE" }); // HTTP method for deleting
        if (!res.ok) {
            throw new Error(await res.text());
        }
        showToast("Student deleted");
        await fetchStudents();       // refresh list
        setSelectedStudent(null);    // clear side panel details since student is gone
        setFormState(null);          // clear form if we were editing that student
    } catch (error) {
        showToast(error.message || "Failed to delete student", true);
    }
};
// very dangerous operation, so we always ask for confirmation first! the same concept as the post and put requests but with delete method













studentsBody.addEventListener("click", (event) => { // EVENT DELEGATION: listening on the parent table body
    // Instead of adding an event listener to EVERY 'View/Edit/Delete' button (which could be hundreds),
    // we add ONE listener to the parent container (studentsBody).
    // the button of view, edit, delete is not taken from html, it is created 'dynamically' by the renderStudents function
    // so we need to use event delegation to listen for clicks on these buttons
    // (event) is the event object that is passed to the event listener, it contains information about the event 
    // which event.target is the element that was clicked under the studentsBody, and closest("button") is used to find the nearest ancestor button of the clicked element
    // and the usual method used is event.dataset.action to find the action of the button, event.target.closest("button") is used to find the nearest ancestor button of the clicked element

    const button = event.target.closest("button"); // check if the clicked element is inside a button, event.target is the element that was clicked
    if (!button) return; // if they clicked a blank space or text, do nothing

    const row = button.closest("tr"); // find the table row <tr> belonging to this button
    const id = row?.dataset?.id;      // get the data-id="..." we stuck on the <tr> earlier

    const student = students.find((item) => String(toId(item)) === String(id)); // find the full student object from our memory array using the ID


    switch (button.dataset.action) {   // check which button was clicked using data-action attribute, dataset is a property of an element that contains all the data attributes of that element and action is the value of the data-action attribute
        case "select":
            setSelectedStudent(student); // runs the setSelectedStudent function with the student object as an argument, this will show the details of the student in the side panel under the form
            break;
        case "edit":
            if (student) {
                setSelectedStudent(student); // runs the setSelectedStudent function with the student object as an argument, this will show the details of the student in the side panel under the form
                setFormState(student);       // runs the setFormState function with the student object as an argument, this will fill the form with the student data for editing
            }
            break;
        case "delete":
            deleteStudent(id);           // runs the deleteStudent function with the id as an argument, this will delete the student from the database
            break;
        default:
            break;
    }
});
// as u can see button.dataset.action is used to find the action of the button, and event.target.closest("button") is used to find the nearest ancestor button of the clicked element
// and when combined it is used to find the action of the button that was clicked

// while for row and id we use button.closest("tr") to find the nearest ancestor table row of the clicked element
// and then row?.dataset?.id to get the data-id attribute of the table row
// and when combined it is used to find the id of the student that was clicked
// buttons are inside <td> table data, which are inside <tr> rows
// why not use closest("td")? because the <td> doesn't have the data-id attribute, the <tr> has it
// checkout back function renderStudents to see how the data-id attribute is added to the <tr> row

//why did we only put the defensive coding at the delete function and not at the view and edit functions?
// because the delete function is the only one that can cause a permanent change to the database
// the view and edit functions are only for displaying and updating the data in the frontend
// and the update function is already protected by the backend

// and also why did we use event delegation instead of adding an event listener to every button?
// because event delegations use less memory, works for dynamically created elements, and is more efficient
// and also it is more organized and easier to maintain

// also the event delegations also doesnt happen to clicks only, it can happen to any event like keydown, keyup, mouseover, mouseout, etc











// simple event listeners
// input is when you type a letter, change is when you select an option, click is when you click a button, submit is when you submit a form
searchInput.addEventListener("input", renderStudents); // "input" event fires every time you type a letter, and calls the renderStudents function
sortSelect.addEventListener("change", renderStudents); // "change" event fires when dropdown selection changes, and calls the renderStudents function
refreshBtn.addEventListener("click", fetchStudents); // standard click, and calls the fetchStudents function





resetBtn.addEventListener("click", () => { // arrow function callback to clear everything, and calls the setFormState and setSelectedStudent functions
    setFormState(null);
    setSelectedStudent(null);
});






studentForm.addEventListener("submit", (event) => { // handle form submission
    event.preventDefault(); // IMPORTANT: prevents the browser from reloading the page (default form behavior)

    const id = studentIdInput.value; // check if we have a hidden ID
    if (id) {
        updateStudent(id); // if ID exists, we are Updating
    } else {
        createStudent();   // if ID is empty, we are Creating new
    }
});

fetchStudents();
// initial load, calls the fetchStudents function,
// why we put here? because we want to fetch the students when the page loads in the beginning
// and also we can't put it in the beginning of the script, because the function hasn't been defined yet, so it will throw an error
// if we dont put it here, the students will not be displayed when the page loads, unless u refresh the page which will call the fetchStudents function again

