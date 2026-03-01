BlogApp API 
A simple RESTful API built with **Node.js**, **Express**, and **MySQL** as part of my backend development learning journey.
This project focuses on practicing core backend concepts such as API design, database integration, and CRUD operations.

Project Overview:
BlogApp is a small backend application that handles user authentication and profile management.
The goal of this project is to strengthen my understanding of:
- RESTful API architecture
- Express routing
- MySQL database integration
- CRUD operations
- Error handling
- Backend logic implementation
This project is for learning purposes and is not production-ready.

---

Features:
- User Registration (Signup)
- User Login
- Get User Profile
- Update User Profile (DOB & Gender optional)
- Delete User Account
- Search Users by First Name

---

Tech Stack:
- Node.js
- Express.js
- MySQL
- mysql2 package
- JSON

---

Setup MySQL Database:
Create a database:
```sql
CREATE DATABASE blogapp;
```
Create `users` table:
```sql
CREATE TABLE users (
  u_id INT PRIMARY KEY AUTO_INCREMENT,
  u_firstName VARCHAR(50) NOT NULL,
  u_lastName VARCHAR(50) NOT NULL,
  u_email VARCHAR(100) UNIQUE NOT NULL,
  u_password VARCHAR(100) NOT NULL,
  u_DOB DATE,
  u_gender VARCHAR(10)
);
```

Configure Database Connection:
Update database credentials in `index.js` if needed:

```js
const DBconnection = mysql2.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"blogapp"
})
```

Run the Server:
Development Mode (auto-restart on changes):
```bash
npm run dev
```
Uses Node.js built-in watch mode.
---
Production Mode
```bash
npm start
```
Server runs on:
```
http://localhost:3000
```
---

API Endpoints:

Base Route:
- `GET /`  (Welcome message)
  
---

Authentication:

POST `/auth/signup`
Creates a new user.
```json
{
  "firstName": "luna",
  "lastName": "loo",
  "email": "luna@gmail.com",
  "password": "123456"
}
```

POST `/auth/login`
Logs in an existing user.

```json
{
  "email": "luna@gmail.com",
  "password": "123456"
}
```

---

User Management:

GET `/user/:id/profile`
Returns user profile with:
- Full Name
- Email
- Calculated Age

PATCH `/user/:id`
Updates user DOB and/or gender (both optional).

Example:
```json
{
  "DOB": "2000-01-01"
}
```
or
```json
{
  "gender": "male"
}
```

DELETE `/user/:id`
Deletes a user account.
GET `/user?searchKey=lu`
Search users by first name.

---

Blog API Documentation:

This section documents the blog-related endpoints of the application.  
The API allows creating blog posts and retrieving blogs with their associated users.

---

Create Blog Post

Endpoint: POST /blog

Description:
Creates a new blog post for an existing user.

Before inserting the blog:
- The API checks if the provided `userId` exists in the `users` table.
- If the user does not exist, it returns an error.
- If the user exists, the blog is inserted into the `blogs` table.

Request Body (JSON)

```json
{
  "title": "Blog Title",
  "content": "Blog Content",
  "userId": 1
}
```

Success Response (201 Created)

```json
{
  "message": "Done",
  "data": { ... }
}
```

Error Responses:
- 404 → Invalid account id
- 500 → Failed to execute query

Database Queries Used:

Check if user exists:
```sql
SELECT * FROM users WHERE u_id = ?
```

Insert blog:
```sql
INSERT INTO blogs (b_title, b_content, b_userId) VALUES (?, ?, ?)
```

---

Get All Blogs With Users:

Endpoint: GET /blog

Description:
Retrieves all blogs along with their associated user data.

The endpoint uses:
- LEFT JOIN
- RIGHT JOIN
- UNION ALL

This ensures:
- All blogs are returned (even if no matching user exists).
- All users are returned (even if they don’t have blogs).

Database Query:

```sql
SELECT * 
FROM blogs 
LEFT JOIN users ON users.u_id = blogs.b_userId

UNION ALL

SELECT * 
FROM blogs 
RIGHT JOIN users ON users.u_id = blogs.b_userId;
```

Success Response (200 OK)

```json
{
  "message": "done",
  "data": [ ... ]
}
```

---

Database Tables:

users:
- u_id (Primary Key)
- Other user-related fields

blogs:
- b_title
- b_content
- b_userId (Foreign Key → users.u_id)

---

Notes:
- All queries use parameterized statements (`?`) to prevent SQL injection.
- The API returns JSON responses.
- Proper error handling is implemented for database failures and invalid user IDs.

Project Status:
This is a learning project created to practice backend development fundamentals.
It is not production-ready and currently lacks:
- Password hashing
- Authentication tokens
- Input validation
- Advanced security measures
- Clean architecture structure (MVC)

---

Future Projects:
In upcoming backend projects, I plan to implement:
- Password hashing using bcrypt
- JWT authentication & authorization
- Input validation (Joi)
- Environment variables (.env)
- Protection against SQL injection
- MVC architecture
- Pagination & filtering
- Posts & comments system
- Role-based access control
- Deployment to cloud platforms

Each new project will build on these improvements as I continue developing my backend skills.

---

Learning Outcomes:
Through this project, I practiced:
- Building REST APIs with Express
- Connecting Node.js to MySQL
- Writing SQL queries
- Handling asynchronous operations
- Implementing CRUD operations
- Structuring backend logic

---

Author:
Shrouk Elsayed 
Junior Backend Developer 
