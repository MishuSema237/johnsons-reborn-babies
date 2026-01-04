# Quick Setup Instructions

## 1. Create `.env.local` File

Create a file named `.env.local` in the `webapp` directory with the following content:

```env
# MongoDB Atlas Connection String


# EmailJS Configuration (for development)
# Get these from https://www.emailjs.com/
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ORDER_CONFIRMATION=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ADMIN_ALERT=

# NextAuth Configuration (for admin portal)
# Generate a random secret: openssl rand -base64 32
NEXTAUTH_SECRET=your_secret_here_change_this
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (REQUIRED for image uploads)
# Get your CLOUDINARY_URL from https://cloudinary.com/console
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin User (for seeding)
ADMIN_EMAIL=admin@rebornbabies.com
ADMIN_PASSWORD=changeme123
```

**Important:** The connection string already includes the database name `reborn_babies`. Make sure your MongoDB Atlas cluster allows connections from your IP address (Network Access settings).

## 2. Test Connection

Test your MongoDB connection:

```bash
npm run test:db
```

Or manually:
```bash
npx tsx lib/scripts/test-connection.ts
```

## 3. Seed Database

Populate the database with initial data:

```bash
npm run seed
```

This will create:
- Sample products
- Default admin user (email: admin@rebornbabies.com, password: changeme123)
- Initial content blocks

**⚠️ IMPORTANT:** Change the admin password after first login!

## 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your site.

## Next Steps

1. ✅ MongoDB connection configured
2. ⏳ Set up EmailJS for order confirmations
3. ⏳ Build order form
4. ⏳ Create admin portal

