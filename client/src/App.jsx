import { Route, Routes } from "react-router-dom";
import { Flowbite } from "flowbite-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import HomeTemplate from "./pages/HomeTemplate";
import SignUp from "./pages/SignUp";
import { useReadQuery } from "./features/api/apiSlice";
import Forget from "./pages/Forget";
import Reset from "./pages/Reset";
import ChangePassword from "./pages/dashboard/ChangePassword";
import Message from "./pages/Message";
import Tickets from "./pages/dashboard/Tickets";
import UsersProfile from "./pages/dashboard/UsersProfile";
import Login from "./pages/Login";
import TicketsDetail from "./pages/dashboard/TicketsDetail";
import TicketsCreate from "./pages/dashboard/TicketsCreate";
import Overview from "./pages/dashboard/Overview";
import SingleTicket from "./components/SingleTicket";

function App() {
  const user = JSON.parse(localStorage.getItem("ticket_user"));

  const { data: admin } = useReadQuery({
    url: "/user/users?role=admin",
    tag: ["users"],
  });

  console.log(user, admin, "user from app js");
  return (
    <Flowbite>
      <div className="font-poppins text-black overflow-hidden text-dark bg-dark">
        <Routes>
          <Route path="/" element={<HomeTemplate />}>
            <Route path="/" element={<Home />}></Route>
            {!user && (
              <Route path="/signup" element={<SignUp type="user" />}></Route>
            )}
            {admin?.total === 0 && (
              <Route
                path="/signup/admin"
                element={<SignUp type="admin" />}
              ></Route>
            )}
            {!user && <Route path="/login" element={<Login />}></Route>}
            <Route path="/forget" element={<Forget />}></Route>
            <Route path="/reset" element={<Reset />}></Route>
            <Route path="/ticket" element={<SingleTicket />}></Route>
          </Route>

          {user && (
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path={`/dashboard`} element={<Overview />}></Route>
              <Route
                path={`/dashboard/${user?.role}`}
                element={<Overview />}
              ></Route>
              {user.role === "user" && (
                <>
                  <Route
                    path="/dashboard/user/profile"
                    element={<UsersProfile />}
                  ></Route>
                  <Route
                    path="/dashboard/user/tickets"
                    element={<Tickets />}
                  ></Route>
                  <Route
                    path="/dashboard/user/tickets/create"
                    element={<TicketsCreate />}
                  ></Route>
                  <Route
                    path="/dashboard/user/tickets/detail"
                    element={<TicketsDetail />}
                  ></Route>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <Route
                    path="/dashboard/admin/profile"
                    element={<UsersProfile />}
                  ></Route>
                  <Route
                    path="/dashboard/admin/tickets"
                    element={<Tickets />}
                  ></Route>
                  <Route
                    path="/dashboard/admin/tickets/create"
                    element={<TicketsCreate />}
                  ></Route>
                  <Route
                    path="/dashboard/admin/tickets/detail"
                    element={<TicketsDetail />}
                  ></Route>
                </>
              )}

              <Route path="/dashboard/message" element={<Message />}></Route>
              <Route
                path="/dashboard/change-password"
                element={<ChangePassword />}
              ></Route>
            </Route>
          )}
          <Route path="*" element={<HomeTemplate />}></Route>
        </Routes>
      </div>
    </Flowbite>
  );
}

export default App;
