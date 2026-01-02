# LinkedIn Clone Backend API

A RESTful API backend for the LinkedIn Clone application built with Node.js, Express, and MongoDB.

## Project Structure

```
linkedin-backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/           # Business logic handlers
│   ├── authController.js  # Authentication (register, login)
│   ├── postController.js  # Posts CRUD and interactions
│   ├── userController.js  # User profiles and connections
│   ├── jobController.js   # Job postings and applications
│   └── messageController.js # Messaging functionality
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── errorHandler.js    # Global error handler
├── models/                # Mongoose schemas
│   ├── User.js           # User model
│   ├── Post.js           # Post model
│   ├── Job.js            # Job model
│   └── Message.js        # Message model
├── routes/                # API route definitions
│   ├── auth.js           # /api/auth routes
│   ├── posts.js          # /api/posts routes
│   ├── users.js          # /api/users routes
│   ├── jobs.js           # /api/jobs routes
│   └── messages.js       # /api/messages routes
├── server.js             # Main server file
└── package.json          # Dependencies and scripts
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/linkedin-clone
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

3. **Start the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Posts (`/api/posts`)

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (Protected)
- `PUT /api/posts/:id` - Update post (Protected)
- `DELETE /api/posts/:id` - Delete post (Protected)
- `PUT /api/posts/:id/like` - Like/Unlike post (Protected)
- `POST /api/posts/:id/comments` - Add comment to post (Protected)
- `PUT /api/posts/:id/share` - Share post (Protected)

### Users (`/api/users`)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user profile (Protected)
- `GET /api/users/:id/connections` - Get user connections
- `POST /api/users/:id/connect` - Send connection request (Protected)
- `PUT /api/users/:id/accept` - Accept connection request (Protected)
- `GET /api/users/suggestions` - Get people you may know (Protected)

### Jobs (`/api/jobs`)

- `GET /api/jobs` - Get all jobs (supports query: ?type=Full-time&location=Bangalore)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job (Protected)
- `PUT /api/jobs/:id` - Update job (Protected)
- `DELETE /api/jobs/:id` - Delete job (Protected)
- `POST /api/jobs/:id/apply` - Apply to job (Protected)

### Messages (`/api/messages`)

- `GET /api/messages` - Get all conversations (Protected)
- `GET /api/messages/:userId` - Get messages with specific user (Protected)
- `POST /api/messages` - Send message (Protected)
- `PUT /api/messages/:id/read` - Mark message as read (Protected)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Data Models

### User
- name, email, password
- title, location, avatar
- connections, connectionsList, pendingConnections
- bio, experience, education

### Post
- author (User reference)
- content, image
- likes, comments, shares arrays
- timestamps

### Job
- title, company, location, type
- description, requirements
- postedBy (User reference)
- applicants array
- salary (min, max, currency)

### Message
- sender, receiver (User references)
- content
- read, readAt
- timestamps

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

