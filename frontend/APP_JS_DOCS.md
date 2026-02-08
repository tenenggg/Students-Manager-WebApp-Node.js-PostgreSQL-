# Frontend Logic Documentation (`frontend/app.js`)

This document provides a line-by-line explanation of the `frontend/app.js` file, which controls the behavior of the student management dashboard.

## 1. Configuration Check

**Line 1**
```javascript
const ENDPOINT = `http://localhost:3000/api/students`;
```
- **What it does**: Defines a constant variable named `ENDPOINT` that stores the URL of your backend API.
- **Why**: Instead of typing `"http://localhost:3000/api/students"` every time we need to fetch data, we use this variable. If the URL changes later (e.g., when deploying to a real server), we only need to change it here once.

---

## 2. Selecting HTML Elements (The DOM)

Lines 5-22 are all about "grabbing" HTML elements so JavaScript can interact with them.

**Lines 5-22**
```javascript
const studentsBody = document.getElementById("studentsBody");
// ... and so on
const statNewest = document.getElementById("statNewest");
```
- **What it does**: Uses the `document.getElementById()` method to find specific HTML elements by their unique `id` attribute.
- **Data Flow**:
    - `studentsBody`: The `<tbody>` where we will insert the list of student rows.
    - `searchInput`, `sortSelect`: Inputs for filtering and sorting the list.
    - `studentForm`, `nameInput`, etc.: The form and its input fields for adding/editing students.
    - `toast`: A hidden notification box for success/error messages.
    - `statTotal`, etc.: Elements where we will display dashboard statistics.

---

## 3. State Management

**Lines 24-25**
```javascript
let students = [];
let activeStudent = null;
```
- **What it does**: Initializes two variables that will hold the "state" of our application.
- **`students`**: An empty array `[]` that will store the list of student objects we receive from the backend.
- **`activeStudent`**: A variable set to `null` initially. It will store the student object currently being edited. If it is `null`, it means we are in "Add Mode". If it has data, we are in "Edit Mode".

---

## 4. Helper Functions

**Line 27**
```javascript
const toId = (student) => student.ID ?? student.id ?? student.Id;
```
- **What it does**: A small helper function to handle inconsistent capitalization in database IDs.
- **Why**: Sometimes databases return `id`, `ID`, or `Id`. This function checks them in order and returns the first one that exists, ensuring our code doesn't break if the casing changes.

**Lines 35-43 (`showToast`)**
```javascript
const showToast = (message, isError = false) => { ... }
```
- **What it does**: Displays a temporary notification popup.
- **Logic**:
    1. Sets the text of the `toast` element.
    2. Sets the background color (Red for error, Dark Blue/Black for success).
    3. Adds the CSS class `"show"` to make it visible.
    4. Uses `setTimeout` to automatically remove the `"show"` class after 2.4 seconds, making it disappear.

---

## 5. Fetching Data (Reading)

**Lines 48-61 (`fetchStudents`)**
```javascript
const fetchStudents = async () => { ... }
```
- **What it does**: Gets the latest list of students from the backend.
- **Flow**:
    1. **`await fetch(ENDPOINT)`**: Sends a `GET` request to `http://localhost:3000/api/students`.
    2. **`res.ok` Check**: Checks if the server responded successfully (status 200-299). If not, it throws an error.
    3. **`res.json()`**: Converts the raw response text into a JavaScript Array of objects.
    4. **`students = ...`**: Updates our global `students` variable with this new data.
    5. **`renderStudents()`**: Calls the function to draw the table.
    6. **`updateStats()`**: Calls the function to update the top statistics numbers.

---

## 6. Updating Statistics

**Lines 63-77 (`updateStats`)**
```javascript
const updateStats = () => { ... }
```
- **What it does**: Calculates summary numbers based on the currently loaded `students` array.
- **Logic**:
    - Updates **Total Students** count.
    - Calculates **Average Age** using `reduce()` to sum up ages and dividing by the count.
    - Finds the **Newest Student** (the last one in the list) and displays their name.

---

## 7. Formatting

**Lines 79-84 (`formatDate`)**
```javascript
const formatDate = (value) => { ... }
```
- **What it does**: Converts raw database date strings (like `2023-01-01T00:00:00.000Z`) into a readable format (like `1/1/2023`).
- **Why**: Raw dates look bad to users. This makes them human-readable.

---

## 8. Rendering the UI

**Lines 86-136 (`renderStudents`)**
```javascript
const renderStudents = () => { ... }
```
- **What it does**: The most important visual function. It takes the `students` data and turns it into HTML table rows.
- **Step-by-Step**:
    1. **Search**: Reads `searchInput.value` to see if the user is typing so we can filter the list.
    2. **Sorting**: Reads `sortSelect.value` and uses `.sort()` to reorder the array (e.g., by Name A-Z or Age).
    3. **Filtering**: Uses `.filter()` to keep only students matching the search text.
    4. **HTML Generation**:
        - If no students match, it inserts a "No students found" row.
        - Otherwise, it uses `.map()` to loop through each student and create a template literal string containing the HTML `<tr>` and `<td>` tags.
    5. **Injection**: Finally, it sets `studentsBody.innerHTML` to this generated HTML string.

---

## 9. Handling Selection & Forms

**Lines 138-156 (`setFormState`)**
```javascript
const setFormState = (student) => { ... }
```
- **What it does**: Toggles the form between "Add Mode" and "Edit Mode".
- **Logic**:
    - If `student` is `null` (Add Mode): Clears all inputs and sets the button text to "Add Student".
    - If `student` exists (Edit Mode): Fills the inputs with that student's name, email, etc., and sets the button text to "Update Student".

**Lines 158-170 (`setSelectedStudent`)**
```javascript
const setSelectedStudent = (student) => { ... }
```
- **What it does**: Updates the "Selected Student" panel on the side of the screen with details of the clicked student.

---

## 10. Data Operations (C.U.D.)

**Lines 172-197 (`createStudent`)**
```javascript
const createStudent = async () => { ... }
```
- **What it does**: Sends a `POST` request to create a new student.
- **Flow**:
    1. Gathers data from the HTML inputs (`nameInput`, `emailInput`, etc.).
    2. Sends it to the backend using `fetch` with `method: "POST"`.
    3. If successful, shows a success toast, re-fetches the list, and clears the form.

**Lines 199-224 (`updateStudent`)**
```javascript
const updateStudent = async (id) => { ... }
```
- **What it does**: Sends a `PUT` request to update an existing student.
- **Flow**: Similar to create, but uses the `PUT` method and includes the ID in the URL (`${ENDPOINT}/${id}`).

**Lines 226-243 (`deleteStudent`)**
```javascript
const deleteStudent = async (id) => { ... }
```
- **What it does**: Deletes a student.
- **Flow**:
    1. Asks for confirmation using `window.confirm`.
    2. Sends a `DELETE` request to the backend.
    3. Refreshes the list upon success.

---

## 11. Event Listeners (The Triggers)

**Lines 245-268 (Table Clicks)**
```javascript
studentsBody.addEventListener("click", (event) => { ... })
```
- **What it does**: Uses **Event Delegation**. Instead of adding a listener to every single "Edit" button, we add ONE listener to the whole table body.
- **Logic**: When you click anywhere in the table:
    1. Checks if you clicked a button (`event.target.closest("button")`).
    2. Gets the `data-action` (edit, delete, or select) from that button.
    3. Finds the corresponding student object.
    4. Calls the relevant function (`setSelectedStudent`, `setFormState`, or `deleteStudent`).

**Lines 270-276 (Controls)**
- `searchInput` -> Triggers `renderStudents` instantly on typing.
- `sortSelect` -> Triggers `renderStudents` on change.
- `refreshBtn` -> Manually triggers `fetchStudents`.
- `resetBtn` -> Clears the form.

**Lines 278-286 (Form Submit)**
```javascript
studentForm.addEventListener("submit", (event) => { ... })
```
- **What it does**: Handles the form submission.
- **Logic**:
    1. `event.preventDefault()`: Stops the page from refreshing (default browser behavior).
    2. Checks if we have an ID (Edit Mode) or not (Add Mode).
    3. Calls either `updateStudent(id)` or `createStudent()`.

---

## 12. Initialization

**Line 288**
```javascript
fetchStudents();
```
- **What it does**: The entry point. Function call that kicks everything off when the page first loads.
