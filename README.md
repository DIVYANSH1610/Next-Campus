# NextCampus 🎓

> **India's smart college discovery platform** — explore, compare, and save your dream colleges.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-next--campus--pearl.vercel.app-0EA5E9?style=for-the-badge&logo=vercel)](https://next-campus-pearl.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)

---

## ✨ What is NextCampus?

NextCampus helps Indian students make smarter college decisions. Instead of scattered information across dozens of websites, NextCampus brings everything into one clean, fast, and modern platform — rankings, fees, placement packages, courses, and more.

---

## 🖼️ Screenshots

| Homepage | College Listing | Compare |
|----------|----------------|---------|
| Cinematic hero with campus video | Search, filter, save | Side-by-side comparison table |

---

## 🚀 Features

- 🎬 **Cinematic Homepage** — full-screen campus video hero with animated gradient orbs
- 🔍 **College Discovery** — search and filter 30+ institutions by rank, fees, city, type
- ⚖️ **Smart Comparison** — compare up to 3 colleges side-by-side with best-value highlights
- ❤️ **Save & Track** — bookmark colleges and manage them from your personal dashboard
- 🔐 **Authentication** — JWT-based credentials login + Google OAuth via NextAuth
- 📊 **Rich College Data** — NIRF rank, avg/highest packages, fees, ratings, courses, reviews
- 📱 **Fully Responsive** — works seamlessly on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + ShadCN UI |
| Animation | Framer Motion |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | NextAuth v5 (JWT + Google OAuth) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (pages)/
│   │   ├── colleges/          # College listing + detail pages
│   │   │   └── [slug]/        # Dynamic college detail
│   │   ├── compare/           # Side-by-side comparison
│   │   ├── dashboard/         # User saved colleges
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── api/
│   │   ├── colleges/          # GET colleges, GET by slug
│   │   ├── saved/             # POST add, GET list
│   │   └── auth/              # Signup, login endpoints
│   └── layout.tsx
├── components/
│   └── navbar.tsx
├── auth.ts                    # NextAuth configuration
└── lib/
    └── utils.ts
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon free tier)

### Installation

```bash
# Clone the repo
git clone https://github.com/DIVYANSH1610/Next-Campus.git
cd Next-Campus

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Database Setup

```bash
# Push schema to database
npx prisma migrate deploy

# Seed colleges data
npx prisma db seed

# Open Prisma Studio (optional)
npx prisma studio
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Roadmap

- [ ] 🤖 AI College Recommender (JEE rank + budget + state → best colleges)
- [ ] 🔄 Infinite scroll on college listing
- [ ] 🔎 Advanced filters (state, fees range, NIRF rank, package)
- [ ] ⭐ Student reviews and ratings
- [ ] 🌙 Dark mode
- [ ] 📰 Featured colleges carousel on homepage
- [ ] 🏆 Alumni success stories section

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

MIT License — feel free to use this project for learning or building upon it.

---

## 👨‍💻 Author

**Divyansh** — [@DIVYANSH1610](https://github.com/DIVYANSH1610)

⭐ If you found this useful, please star the repo — it helps a lot!

---

<p align="center">Built with ❤️ for Indian students</p>