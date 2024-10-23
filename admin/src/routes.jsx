import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { IoTicketOutline } from "react-icons/io5";
import { Home, Notifications, Counter, Trip,Food } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Vehicles from "./pages/dashboard/vehicles";
import TicketBooking from "./pages/dashboard/ticketBooking";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Food",
        path: "/food",
        element: <Food />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "counter",
        path: "/counter",
        element: <Counter />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "vehicles",
        path: "/vehicles",
        element: <Vehicles />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "trip",
        path: "/trip",
        element: <Trip />,
      },
      // {
      //   icon: <IoTicketOutline  {...icon} />,
      //   name: "Ticket Booking",
      //   path: "/ticket-booking",
      //   element: <TicketBooking/>,
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
