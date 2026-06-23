import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/db';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Collegeपथ – Discover and Compare Your Dream College',
  description: 'CollegePath helps students discover, compare, and shortlist top-tier colleges in India. Predict your admission chances with the Rank Predictor tool.',
};

async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return { user: null, ssrChecked: true };

    const decoded = await verifyJWT(token);
    if (!decoded) return { user: null, ssrChecked: true };

    // Fetch user from DB, wrap in try/catch to prevent boot crashes if DB is not linked yet
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true },
    });
    return { user, ssrChecked: true };
  } catch (error) {
    console.warn('⚠️ Session DB check failed (this is normal if DATABASE_URL is not configured yet):', error);
    return { user: null, ssrChecked: false };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, ssrChecked } = await getSessionUser();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="font-sans min-h-screen flex flex-col antialiased selection:bg-indigo-500/30 selection:text-white">
        <AuthProvider initialUser={user} ssrChecked={ssrChecked}>
          {/* Animated Background Orbs */}
          <div className="glow-orb-1" />
          <div className="glow-orb-2" />

          {/* Navigation Bar */}
          <Navbar />
          
          {/* Main App Workspace */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          
          {/* Branding Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
