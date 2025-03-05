import React, { useEffect, useState } from "react";
import LoadingButton from "../../components/loading/LoadingButton";
import { useCreateMutation } from "../../features/api/apiSlice";
import Response from "../../components/Response";

const TicketsCreate = () => {
  const user = JSON.parse(localStorage.getItem("ticket_user"));

  const [createData, createResponse] = useCreateMutation();
  const [createPending, setCreatePending] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [status, setStatus] = useState("");

  const createHandler = () => {
    createData({
      user: user?._id,
      title,
      description,
      // status,
      url: "/user/tickets",
      tag: ["tickets"],
    });
  };

  useEffect(() => {
    if (createResponse?.status === "fulfilled") {
      window.location.reload();
    }
  }, [createResponse]);

  return (
    <div>
      <Response
        response={createResponse}
        setPending={setCreatePending}
        redirectTo={`/dashboard/${user?.role}/tickets`}
      />

      <div class="from-white to-red-200 bg-gradient-to-tl dark:bg-gray-700 dark:text-white text-gray-700 rounded-sm shadow-lg px-5 py-6 mx-3 w-full md:w-[90%] md:px-main">
        <p className="text-lg font-bold mb-3">Create New Ticket</p>{" "}
        <p class="text-xs mb-2">
          At the movement you create a ticket Barcode and QRCode will be
          automatically generated.
        </p>
        <div class="flex flex-col md:flex-row items-start gap-2 justify-between mb-8">
          <div class="flex w-full flex-col">
            <div class="text-sm mb-2">Title</div>

            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              className="w-full bg-dark h-12 p-2.5 px-2 rounded-lg border"
            />
          </div>
        </div>
        <div class=" border-gray-300 pb-4 mb-5">
          <div class="flex w-full mb-2 flex-col">
            <div class="text-sm mb-2">Description</div>

            <textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full bg-dark h-40 p-3 px-2 rounded-lg border resize-none"
            ></textarea>
          </div>
        </div>
        <LoadingButton
          pending={createPending}
          onClick={createHandler}
          title="Create"
          color="bg-main"
          width="w-full"
        />
      </div>
    </div>
  );
};

export default TicketsCreate;
