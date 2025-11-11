import "./globals.css";
import Header from "../components/Header";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Data Refine",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        {children}
    </body>
    </html>
    </ClerkProvider>
  );
}
