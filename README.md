# Membership Blogs

A full-stack membership-based blogging platform built with Node.js, Express, PostgreSQL, and Passport.js authentication. Users can register, log in, and create blog posts with premium membership features.

## Features

- **User Authentication**: Secure registration and login system using Passport.js with bcrypt password hashing
- **Membership Tiers**: Premium and standard membership levels with differentiated content access
- **Message Board**: Create and view messages/blog posts with author attribution and timestamps
- **Session Management**: Persistent user sessions with Express Session
- **Responsive Design**: Modern, accessible UI with gradient backgrounds and smooth animations
- **Protected Routes**: Authentication middleware to secure sensitive endpoints
- **Flash Messages**: User-friendly error and success notifications
- **PostgreSQL Database**: Robust data persistence with connection pooling

## Tech Stack

- **Backend**: Node.js, Express.js
- **Authentication**: Passport.js (Local Strategy), bcrypt
- **Database**: PostgreSQL with pg driver
- **Templating**: EJS
- **Session Management**: express-session, express-flash
- **Development**: Nodemon for hot reloading

## Prerequisites

Before running this application, ensure you have:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Database Setup

1. Install and start PostgreSQL on your system

2. Create a new database:
```sql
CREATE DATABASE membership;
```

3. Connect to the database and create the required tables:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  membership_status VARCHAR(50) DEFAULT 'Premium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_messages_user_id ON message(user_id);
CREATE INDEX idx_messages_timestamp ON message(timestamp DESC);
CREATE INDEX idx_users_email ON users(email);
```

4. Update database connection in `db/pools.js`:
```javascript
module.exports = new Pool({
  connectionString: 'postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/membership',
});
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Zahoorudin-dev/membership-blogs.git
cd membership-blogs
```

2. Install dependencies:
```bash
npm install
```

3. Configure your database connection in `db/pools.js`

4. Start the development server:
```bash
npm run server
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure
```
membership-blogs/
├── controller/
│   └── authControls.js       # Authentication and message controllers
├── db/
│   ├── pools.js              # PostgreSQL connection pool
│   └── quries.js             # Database query functions
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── messageRoutes.js      # Message/blog post routes
├── views/
│   ├── index.ejs             # Main messages dashboard
│   ├── login.ejs             # Login page
│   ├── register.ejs          # Registration page
│   └── message.ejs           # Create message page
├── passport-config.js        # Passport authentication configuration
├── server.js                 # Application entry point
└── package.json              # Project dependencies
```

## API Routes

### Authentication Routes
- `GET /api/auth/register` - Display registration page
- `POST /api/auth/register` - Register new user
- `GET /api/auth/login` - Display login page
- `POST /api/auth/login` - Authenticate user
- `GET /logout` - Logout current user

### Message Routes
- `GET /` - View all messages (authenticated users only)
- `GET /api/create/message` - Display message creation form
- `POST /api/create/message` - Create new message
- `GET /api/messages` - Fetch all messages

## Features in Detail

### Authentication System
- Password hashing with bcrypt (10 salt rounds)
- Session-based authentication using Passport.js Local Strategy
- Protected routes with authentication middleware
- Email uniqueness validation
- Secure password storage

### Membership System
- Default Premium membership on registration
- Membership-based content filtering
- Premium users see all messages
- Standard users see only premium content

### Message Board
- Rich text message creation with title and body
- Author attribution with username display
- Timestamp tracking for all posts
- Ordered by most recent first
- User-specific message filtering capability

### Security Features
- Password hashing before database storage
- Session secret configuration
- CSRF protection through session management
- SQL injection prevention with parameterized queries
- Authentication checks on protected routes

## Environment Variables

For production deployment, configure these environment variables:
```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=production
```

## Development

To contribute or modify:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- Comment system for messages
- User profile pages with edit capabilities
- Rich text editor for message creation
- Image upload support
- Search and filter functionality
- Email verification on registration
- Password reset functionality
- Admin dashboard for user management
- Rate limiting for API endpoints
- OAuth integration (Google, GitHub)

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `db/pools.js`
- Ensure database exists: `psql -l`

### Authentication Problems
- Clear browser cookies and sessions
- Verify bcrypt is properly installed
- Check session secret is configured

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

## License

This project is open source and available under the MIT License.

## Author

**Zahooruddin Dev**
- GitHub: [@Zahoorudin-dev](https://github.com/Zahooruddin-dev)
- Email: mzkhan886@gmail.com

## Acknowledgments

- Express.js documentation
- Passport.js authentication strategies
- PostgreSQL community
- Node.js ecosystem contributors

---

Built with ❤️ using Node.js and PostgreSQL