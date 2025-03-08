import Navbar from "@/components/Navbar";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ToastContainer } from "react-toastify";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-black to-gray-900">
        <Providers>
          <Navbar />
          {children}
          <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        </Providers>
      </body>
    </html>
  );
}
