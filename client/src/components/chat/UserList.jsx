import React from "react";
import Loading from "../loading/Loading";

const UserList = ({
  userIsFetching,
  userData,
  currentUser,
  setReceiverId,
  setSenderId,
  onlineUsers,
  setSearch,
  receiver,
  setReceiverUser,
  limit,
  setLimit,
}) => {
  return (
    <div
      id="user_lists"
      className="flex w-full bg-white bg-dark relative z-20 h-[85.5vh] border border-t-0 border-dark overflow-hidden flex-col md:flex-[20%]"
    >
      {/* search */}
      <div className="w-full flex flex-col  border-dark items-center justify-start shadow-sm h-[41px] border-b">
        <div class="w-full border-t md:border-t-0 border-dark bg-gray-200">
          <div class="relative ml-12 md:ml-0 ">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              id="default-search"
              class="block w-full p-[8px] h-[44px] bg-gray-50 md:bg-gray-200 focus:ring-0 text-dark ps-10 text-sm text-gray-900 border-none bg-dark focus:outline-none"
              placeholder="Search users"
              required
            />
          </div>
        </div>
      </div>
      {/* user list */}
      <div className="flex w-full scrollbar-w-[4px] relative flex-col  mt-[4px] h-full  scrollbar scrollbar-thumb-slate-300 overflow-y-auto">
        {userIsFetching && <Loading text="text-gray-500" />}
        <ul className="w-full md:max-w-sm  divide-y divide-gray-200 dark:divide-gray-700">
          {userData && userData?.length > 0 ? (
            userData?.map((user, i) => {
              if (user?._id !== currentUser?._id) {
                return (
                  <li
                    key={i}
                    id={i.toString()}
                    onClick={() => {
                      setReceiverId(user?._id);
                      setSenderId(currentUser?._id);
                      setReceiverUser(user);
                      const id = document.getElementById("user_list_container");
                      id?.classList?.value?.includes("hidden")
                        ? id?.classList?.remove("hidden")
                        : id?.classList?.add("hidden");
                    }}
                    className={`p-[6px] hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      user?._id === receiver
                        ? "bg-gray-200 dark:bg-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex cursor-pointer items-center space-x-4 rtl:space-x-reverse">
                      <div className="relative">
                        {user?.profilePicture?.length > 1 ? (
                          <img
                            class="w-9 h-9 rounded-full"
                            src={user?.profilePicture}
                            alt="photo"
                          />
                        ) : (
                          <div className="w-9 h-9 p-1 text-xl font-bold rounded-full flex items-center justify-center bg-red-700 text-white text-center">
                            {user?.email?.substring(0, 1)}
                          </div>
                        )}
                        <span
                          className={`top-0 left-6 absolute  w-3 h-3 ${
                            onlineUsers?.includes(user?.email)
                              ? "bg-green-400"
                              : "bg-gray-200"
                          }  border-2 border-white dark:border-gray-800 rounded-full`}
                        ></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className=" font-medium text-gray-900 truncate dark:text-white">
                          {user?.firstName
                            ? `${user?.firstName} ${user?.lastName}`
                            : user?.role}
                        </p>
                        <p className=" mt-[2px] text-gray-500 truncate dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              }
            })
          ) : (
            <div className="w-full mt-5 text-center">Users Not Found</div>
          )}
          {userData?.length >= 30 && (
            <p
              onClick={() => setLimit(limit + 30)}
              className=" bg-red-400s hover:bg-gray-200 text-center bg-dark cursor-pointer p-1 text-xs"
            >
              See more
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
