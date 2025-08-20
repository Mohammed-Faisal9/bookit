import { Inter } from "next/font/google";
import "./styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthWrapper from "../components/AuthWrapper";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Bookit app | Book a room",
  description: "Book a meeting or conference room for your team in seconds.",
};

export default function RootLayout({ children }) {
  return (
    <AuthWrapper>
      <html lang="en">
        <body className={`${inter.className} `}>
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </AuthWrapper>
  );
}
