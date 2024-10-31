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
import ConductorHome from "./pages/conductor/ConductorHome";
import AssignedRoutes from "./pages/conductor/AssignedRoutes";
import SwapShift from "./pages/conductor/SwapShift";


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
      {
        icon: <IoTicketOutline  {...icon} />,
        name: "Ticket Booking",
        path: "/ticket-booking",
        element: <TicketBooking/>,
        

      },
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
// start Driver route
export const driverRoutes = [
{
  layout: "driver",
  pages: [
    {
      icon: <HomeIcon {...icon} />,
      name: "Conductor Dashboard",
      path: "/home",
      element: <ConductorHome />,
    },
    {
      icon: <UserCircleIcon {...icon} />,
      name: "Assigned Routes",
      path: "/assigned-routes",
      element: <AssignedRoutes />,
    },
    {
      icon: <UserCircleIcon {...icon} />,
      name: "Swap Shift",
      path: "/swaf-shift",
      element: <SwapShift />,
    },
   
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

export const conductorRoutes = [
  {
    layout: "conductor",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Conductor Dashboard",
        path: "/home",
        element: <ConductorHome />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Assigned Routes",
        path: "/assigned-routes",
        element: <AssignedRoutes />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Swap Shift",
        path: "/swaf-shift",
        element: <SwapShift />,
      },
      
     
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