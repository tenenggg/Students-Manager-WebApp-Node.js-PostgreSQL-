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

let students = []; // in-memory list from API, meaning data stored temporarily in this variable
let activeStudent = null; // currently edited student

const toId = (student) => student.ID ?? student.id ?? student.Id; // normalize id keys







const showToast = (message, isError = false) => { // temporary UI message
    toast.textContent = message;
    toast.style.background = isError ? "#991b1b" : "#111827";
    toast.classList.add("show");
    window.clearTimeout(toast.hideTimer);
    toast.hideTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
};




const fetchStudents = async () => { // GET all students
    try {
        const res = await fetch(ENDPOINT);
        if (!res.ok) {
            throw new Error(await res.text());
        }
        const data = await res.json();
        students = Array.isArray(data) ? data : [];
        renderStudents();
        updateStats();
    } catch (error) {
        showToast(error.message || "Failed to load students", true);
    }
};

const updateStats = () => { // update summary cards
    statTotal.textContent = students.length;
    if (!students.length) {
        statAvgAge.textContent = "-";
        statNewest.textContent = "-";
        return;
    }

    const ages = students.map((student) => Number(student.age)).filter((age) => !Number.isNaN(age));
    const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : "-";
    statAvgAge.textContent = avgAge;

    const newest = students[students.length - 1];
    statNewest.textContent = newest?.name ?? "-";
};

const formatDate = (value) => { // safe date formatting
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
};

const renderStudents = () => { // render table from state
    const query = searchInput.value.trim().toLowerCase();
    const sorted = [...students];

    switch (sortSelect.value) {
        case "name-desc":
            sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
            break;
        case "age-asc":
            sorted.sort((a, b) => Number(a.age || 0) - Number(b.age || 0));
            break;
        case "age-desc":
            sorted.sort((a, b) => Number(b.age || 0) - Number(a.age || 0));
            break;
        default:
            sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            break;
    }

    const filtered = sorted.filter((student) => { // client-side search
        if (!query) return true;
        return (
            (student.name || "").toLowerCase().includes(query) ||
            (student.email || "").toLowerCase().includes(query)
        );
    });

    if (!filtered.length) {
        studentsBody.innerHTML = '<tr><td class="empty" colspan="5">No students found.</td></tr>';
        return;
    }

    studentsBody.innerHTML = filtered // build rows
        .map((student) => {
            const id = toId(student);
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
            `;
        })
        .join("");
};

const setFormState = (student) => { // switch between add/edit mode
    if (!student) {
        activeStudent = null;
        formTitle.textContent = "Add Student";
        submitBtn.textContent = "Add Student";
        studentForm.reset();
        studentIdInput.value = "";
        return;
    }

    activeStudent = student;
    formTitle.textContent = "Edit Student";
    submitBtn.textContent = "Update Student";
    studentIdInput.value = toId(student) ?? "";
    nameInput.value = student.name ?? "";
    emailInput.value = student.email ?? "";
    ageInput.value = student.age ?? "";
    dobInput.value = student.dob ? String(student.dob).slice(0, 10) : "";
};

const setSelectedStudent = (student) => { // show details in side panel
    if (!student) {
        selectedStudent.innerHTML = "<p>Select a student to view details.</p>";
        return;
    }

    selectedStudent.innerHTML = `
        <p><span class="badge">${student.name ?? "-"}</span></p>
        <p><strong>Email:</strong> ${student.email ?? "-"}</p>
        <p><strong>Age:</strong> ${student.age ?? "-"}</p>
        <p><strong>Date of Birth:</strong> ${formatDate(student.dob)}</p>
    `;
};

const createStudent = async () => { // POST new student
    const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: Number(ageInput.value),
        dob: dobInput.value,
    };

    try {
        const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        showToast("Student added");
        await fetchStudents();
        setFormState(null);
    } catch (error) {
        showToast(error.message || "Failed to add student", true);
    }
};

const updateStudent = async (id) => { // PUT update by id
    const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: Number(ageInput.value),
        dob: dobInput.value,
    };

    try {
        const res = await fetch(`${ENDPOINT}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        showToast("Student updated");
        await fetchStudents();
        setFormState(null);
    } catch (error) {
        showToast(error.message || "Failed to update student", true);
    }
};

const deleteStudent = async (id) => { // DELETE by id
    if (!id) return;
    const confirmed = window.confirm("Delete this student?");
    if (!confirmed) return;

    try {
        const res = await fetch(`${ENDPOINT}/${id}`, { method: "DELETE" });
        if (!res.ok) {
            throw new Error(await res.text());
        }
        showToast("Student deleted");
        await fetchStudents();
        setSelectedStudent(null);
        setFormState(null);
    } catch (error) {
        showToast(error.message || "Failed to delete student", true);
    }
};

studentsBody.addEventListener("click", (event) => { // event delegation for table buttons
    const button = event.target.closest("button");
    if (!button) return;
    const row = button.closest("tr");
    const id = row?.dataset?.id;
    const student = students.find((item) => String(toId(item)) === String(id));

    switch (button.dataset.action) {
        case "select":
            setSelectedStudent(student);
            break;
        case "edit":
            if (student) {
                setSelectedStudent(student);
                setFormState(student);
            }
            break;
        case "delete":
            deleteStudent(id);
            break;
        default:
            break;
    }
});

searchInput.addEventListener("input", renderStudents); // live search
sortSelect.addEventListener("change", renderStudents); // resort list
refreshBtn.addEventListener("click", fetchStudents); // refetch from server
resetBtn.addEventListener("click", () => { // clear form + selection
    setFormState(null);
    setSelectedStudent(null);
});

studentForm.addEventListener("submit", (event) => { // create or update
    event.preventDefault();
    const id = studentIdInput.value;
    if (id) {
        updateStudent(id);
    } else {
        createStudent();
    }
});

fetchStudents(); // initial load
