# Students Manager (Node.js + PostgreSQL)

A full-stack learning project that demonstrates a simple CRUD API with Express and PostgreSQL plus a clean, minimal frontend dashboard to manage student records.

## Features
- Create, read, update, and delete students
- Search and sort students on the client
- Summary stats (total, average age, newest)
- Clear backend layering (routes, controllers, models)
- PostgreSQL connection pooling via `pg`

## Tech Stack
- Backend: Node.js, Express, PostgreSQL, `pg`, `dotenv`, `cors`
- Frontend: Vanilla HTML/CSS/JS

## Project Structure
```
backend/
  server.js
  src/
    route.js
    config/
      db.js
    controller/
      studentscontroller.js
    model/
      studentmodel.js
frontend/
  index.html
  styling.css
  app.js
```

## Architecture Flow
Request path example:
```
GET /api/students/5
server.js -> route.js -> studentscontroller.js -> studentmodel.js -> database
model -> controller -> response
```

## API Endpoints
Base URL: `http://localhost:3000/api/students`

- `GET /` - list all students
- `GET /:id` - get a student by id
- `POST /` - add a student
- `PUT /:id` - update a student by id
- `DELETE /:id` - delete a student by id

### Example JSON (POST/PUT)
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "age": 19,
  "dob": "2005-01-01"
}
```

## Database Schema (Expected)
This project expects a `students` table with a primary key column named `ID`.

```sql
CREATE TABLE students (
  "ID" SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  dob DATE NOT NULL
);
```

## Environment Variables
Create a `.env` file inside `backend/`:
```
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
```

## Setup and Run

### 1) Backend
```bash
cd backend
npm install
node server.js
```
Optional (auto-reload during development):
```bash
npx nodemon server.js
```

### 2) Frontend
Open [frontend/index.html](frontend/index.html) in a browser.

If your backend runs on a different port or host, update the `ENDPOINT` in [frontend/app.js](frontend/app.js).

## Notes
- The backend uses a simple layered approach: routing -> controller -> model -> database.
- Client-side filtering and sorting happen in the browser for fast UI updates.

## License
ISC
