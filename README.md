# KaamSetu - Production Ready Platform

Connecting workers and employers across India, starting with Uttar Pradesh.

## Architecture
- **Frontend**: React.js with Vite, Context API for State/Language, Lucide-Icons.
- **Backend**: Node.js/Express, MongoDB (Mongoose), Socket.io for real-time chat.
- **Security**: JWT, OTP simulation, Helmet, XSS Protection, Rate Limiting, NoSQL Injection protection.

## Production Features
- **OTP Auth**: Robust registration flow with mobile verification.
- **RBAC**: Role-Based Access Control (Worker, Employer, Admin).
- **Abuse Control**: Reporting system with Admin dashboard resolution.
- **Optimized Queries**: Strategic indexing on MongoDB for skill, location, and rating searches.
- **Error Handling**: Centralized middleware for clean API errors.

## Deployment Guide
1. **Database**: Use MongoDB Atlas for a scalable cloud database.
2. **Backend**: Package with PM2 and deploy on AWS EC2 or Heroku/Render.
3. **Frontend**: Build using `npm run build` and deploy on Vercel/Netlify.
4. **Environment**: Ensure all variables in `.env.example` are set on the hosting provider.
5. **SSL**: Use HTTPS for production to protect JWT tokens.

## Commands
```bash
# Install dependencies
npm install

# Run Dev Server
npm run dev

# Run Production
npm start
```

## Future Roadmap
- [ ] Integration with Twilio for real SMS.
- [ ] Direct payment gateway for job insurance.
- [ ] Map API integration for location accuracy.
- [ ] PWA support for offline access.
