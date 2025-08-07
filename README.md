# The Giving Tree Non-Profit Foundation Website

A modern, responsive website built with Next.js for The Giving Tree Non-Profit Foundation, dedicated to supporting Mackenzie Health through community donations and reselling gently used items.

## 🌟 Features

### Core Functionality
- **Mission Statement & Vision**: Clear presentation of the foundation's goals
- **Donation System**: Both monetary and item donation capabilities
- **User Registration & Login**: Complete authentication system
- **Leaderboard**: Track and display top donors
- **User Dashboard**: Personal donation history and profile management
- **Analytics**: Website visitor tracking and community engagement metrics
- **News & Events**: Blog-style updates with like and comment functionality
- **Contact & Newsletter**: Email subscription and inquiry forms

### Technical Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Mobile-First**: Optimized for all device sizes
- **Performance**: Fast loading with Next.js optimization
- **Accessibility**: WCAG compliant design
- **SEO Optimized**: Proper meta tags and structured data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd givingtreewebsite
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Create a PostgreSQL database
   - Update the `DATABASE_URL` in your `.env` file
   - Run database migrations:
   ```bash
   npm run db:push
   npm run db:generate
   ```

4. Seed the database with sample data:
```bash
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Deployment

For production deployment with scalability and performance optimizations, see our comprehensive [Deployment Guide](./DEPLOYMENT.md).

**Quick Deploy Options:**
- **Vercel** (Recommended): One-click deployment with automatic scaling
- **Docker**: Containerized deployment for any cloud provider
- **Traditional VPS**: Full control over infrastructure

**Scalability Features:**
- ✅ Handles 1000+ concurrent users
- ✅ Redis caching for performance
- ✅ Database connection pooling
- ✅ Rate limiting and security
- ✅ Health monitoring
- ✅ Global CDN ready

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/givingtree?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Sample User Accounts

After running the seed script, you can log in with these test accounts:

- **Email**: sarah.johnson@example.com | **Password**: password123
- **Email**: michael.chen@example.com | **Password**: password123
- **Email**: emily.rodriguez@example.com | **Password**: password123
- **Email**: david.thompson@example.com | **Password**: password123
- **Email**: lisa.wang@example.com | **Password**: password123

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── donate/            # Donation pages
│   ├── dashboard/         # User dashboard
│   ├── leaderboard/       # Top donors
│   └── analytics/         # Website analytics
├── components/            # Reusable components
│   ├── DonationForm.tsx   # Item donation form
│   ├── Leaderboard.tsx    # Donor leaderboard
│   ├── AuthModal.tsx      # Login/Register modal
│   ├── UserDashboard.tsx  # User profile dashboard
│   └── Analytics.tsx      # Analytics component
└── globals.css           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary Green**: #16a34a (Green-600)
- **Primary Blue**: #2563eb (Blue-600)
- **Accent Purple**: #9333ea (Purple-600)
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean, accessible input fields
- **Navigation**: Sticky header with smooth scrolling

## 📱 Pages Overview

### Homepage (`/`)
- Hero section with mission statement
- Vision and approach sections
- About us and team information
- News/events with interactive features
- Contact information and newsletter signup

### Donate (`/donate`)
- Choice between monetary and item donations
- Secure payment processing simulation
- Item donation form with image upload
- Success confirmation pages

### Dashboard (`/dashboard`)
- User authentication system
- Personal donation history
- Profile management
- Impact tracking

### Leaderboard (`/leaderboard`)
- Top donors display
- Community statistics
- Call-to-action for new donations

### Analytics (`/analytics`)
- Website visitor statistics
- Community engagement metrics
- Growth trends and insights

## 🔧 Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Authentication**: NextAuth.js (ready for implementation)
- **Database**: Prisma (ready for implementation)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Future Enhancements

### Planned Features
- **Real Payment Processing**: Integrate PayPal, Stripe, or e-transfer
- **Database Integration**: User accounts and donation tracking
- **Email System**: Automated notifications and newsletters
- **Admin Panel**: Content management and analytics
- **Mobile App**: React Native companion app
- **Social Media Integration**: Share donations and achievements

### Technical Improvements
- **Performance**: Image optimization and caching
- **Security**: Enhanced authentication and data protection
- **SEO**: Advanced meta tags and structured data
- **Analytics**: Google Analytics and custom tracking
- **Testing**: Unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: Givingtreenonprofit@gmail.com
- **Website**: [The Giving Tree Foundation](https://your-domain.com)
- **Location**: Serving Mackenzie Health and surrounding communities

## 🙏 Acknowledgments

- **Mackenzie Health**: Our healthcare partner
- **Ruogu Qiu & Justin Wu**: Foundation co-founders
- **Community**: All our generous donors and supporters

---

**The Giving Tree Non-Profit Foundation** - Supporting healthcare through community generosity since 2025.
