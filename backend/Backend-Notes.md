Backend routing flow (students example)

1) server.js (entry point)
- Mounts a router for each resource/table.
- Example: app.use("/api/students", studentRoutes)
- This sets the base path for all student routes.

2) route.js (routing layer)
- Defines endpoints relative to the base path.
- Example:
  - router.get("/", controller.getStudents)        -> /api/students/
  - router.get("/:id", controller.getStudentById)  -> /api/students/:id

3) studentscontroller.js (controller layer)
- Receives req/res, handles business logic.
- Calls the model to fetch or update data.
- Sends the response back to the client.

4) studentmodel.js (model layer)
- Contains database queries (PostgreSQL).
- Returns data to the controller.

so in this project case there's one table, but 





Request flow example:
GET /api/students/5
server.js -> route.js -> controller -> model -> database
model -> controller -> response


-) config/db.js (database connection)
- Creates and exports the PostgreSQL connection/pool.
- Used by model files to run queries.

-) .env (environment variables)
- Stores secrets and config (DB host, user, password, port, database name).
- Loaded at startup so db.js and other modules can read them.





Backend Server(NodeJS) coding setup steps:

1) make db.js first
2) make .env file
3) make model file
4) make controller file
5) make route file
6) make server.js file
7) run npm init -y
8) run npm install express pg dotenv
9) run npm start
