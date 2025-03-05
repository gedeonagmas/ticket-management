import React from "react";
import { useReadQuery } from "../../features/api/apiSlice";

const Overview = () => {
  const user = JSON.parse(localStorage.getItem("ticket_user"));
  const fetchBy = user?.role === "user" ? `user=${user?._id}` : "";

  const { data } = useReadQuery({
    url: `/user/tickets?${fetchBy}&populate=user`,
    tag: ["tickets"],
  });

  const { data: users } = useReadQuery({
    url: `/user/users`,
    tag: ["users"],
  });

  return (
    <div className="min-h-[82vh] pb-10 pr-10">
      <p className="text-lg font-bold">
        Well Come <span className="text-main">{user?.firstName}</span>
      </p>
      <div className="border flex items-center justify-center gap-4 p-5 w-64 mt-4 shadow rounded-lg">
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
            clip-rule="evenodd"
          />
        </svg>
        {new Date().toDateString()}
      </div>

      <p className="mt-5 font-bold mb-2 text-main text-xl">
        MERN Stack Expert.
      </p>
      <p>
        I am a Full Stack Software Developer with a diverse skill set that
        enables me to build dynamic and responsive web applications. Proficient
        in MongoDB, Express JS, React JS, Node JS, and React Native, I am
        well-equipped to create efficient and scalable full-stack solutions.
      </p>

      <p>
        I have hands-on experience in developing RESTful APIs, managing
        databases, and implementing intricate front-end designs, as well as
        mobile application development.
      </p>

      <div className="w-full flex items-center justify-between flex-col lg:flex-row gap-5">
        <div className="w-full">
          <p className="text-xl font-bold text-main mt-5 mb-2">
            {user?.role === "admin" ? "Total" : "Your"} tickets
          </p>
          <a
            href={`/dashboard/${user?.role}/tickets`}
            className="p-5 hover:bg-gray-200 cursor-pointer w-64 rounded-lg border flex flex-col gap-5 items-center justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <p className="text-lg font-bold ">tickets</p>
              <svg
                class="w-6 h-6 text-main"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-lg font-bold">Total</p>
              {data?.data?.length}
            </div>
          </a>
        </div>
        {user?.role === "admin" && (
          <div className="w-full">
            <p className="text-xl font-bold text-main mt-5 mb-2">Total Users</p>
            <div className="p-5 w-64 rounded-lg border flex flex-col gap-5 items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <p className="text-lg font-bold ">Users</p>
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-lg font-bold">Total</p>
                {users?.data?.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
