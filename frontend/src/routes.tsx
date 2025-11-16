import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "./shared/RootLayout"
import Home from "./pages/Home"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { ListingDetails } from "./pages/ListingDetails"
import MyBookings from "./pages/MyBookings"
import CreateListing from "./pages/CreateListing"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "listing/:id", element: <ListingDetails /> },
      { path: "bookings", element: <MyBookings /> },
      { path: "host/create", element: <CreateListing /> },
    ],
  },
])
