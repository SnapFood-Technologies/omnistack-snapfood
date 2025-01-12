# SnapFood Restaurant Admin Dashboard

A modern restaurant management platform built with Next.js 14 and TypeScript, designed to help restaurant owners manage their menus, orders, and delivery operations efficiently.

## Features

- 📱 Modern responsive dashboard UI using shadcn/ui
- 🔐 Authentication with Next-Auth
- 🗃️ MongoDB integration with Prisma ORM
- 🔍 Real-time menu management
- 📊 Order tracking and analytics
- 💳 Restaurant profile management
- 🎨 QR code generator for menus
- 🌙 Light/Dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Authentication**: Next-Auth
- **Database**: MongoDB Atlas
- **ORM**: Prisma
- **Deployment**: Netlify

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/SnapFood-Technologies/omnistack-snapfood/
   cd snapfood-admin
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

````env
# Database
DATABASE_URL="your-mongodb-atlas-url"

# Auth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"


## Database Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update your `.env.local` with the connection string
5. Run Prisma migrations:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

## Deployment

The project is deployed on Netlify. To deploy your own instance:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
    - Build command: `npm run build`
    - Output directory: `.next`
4. Add environment variables in the Netlify dashboard
5. Deploy!

## Database Schema

Key models include:

- User
- Restaurant
- Menu
- Category
- Product
- Order
- QRCode

## Features in Development

- Advanced analytics dashboard
- Multi-language support
- Bulk menu imports
- Advanced inventory management
- Staff management system
- Mobile application

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Support

For support, please open an issue in the GitHub repository.

## Authors

Griseld Gerveni - Initial work - GitHub

## Acknowledgments

- shadcn/ui for the UI components
- Netlify for hosting
- MongoDB Atlas for database hosting
- Next.js team for the framework
````
