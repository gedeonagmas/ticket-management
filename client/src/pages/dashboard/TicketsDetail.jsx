import React, { useEffect, useRef, useState } from "react";
import LoadingButton from "../../components/loading/LoadingButton";
import {
  useUpdateMutation,
  useLazyReadQuery,
  useDeleteMutation,
} from "../../features/api/apiSlice";
import Response from "../../components/Response";
import jsPDF from "jspdf";
import { utils, writeFile } from "xlsx";
import DeleteIcon from "@mui/icons-material/Delete";
import Pop from "../../components/Pop";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";

const TicketsDetail = ({ type }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("ticket_user"));
  const id = location?.search?.split("?id=")[1];

  const [updateData, updateResponse] = useUpdateMutation();
  const [createPending, setCreatePending] = useState(false);
  const [deleteData, deleteResponse] = useDeleteMutation();
  const [deletePending, setDeletePending] = useState(false);
  const [popup, setPopup] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const deleteHandler = () => {
    id &&
      deleteData({
        url: `/user/tickets?id=${id}`,
        tag: ["tickets"],
      });
  };

  useEffect(() => {
    if (deleteResponse?.status === "fulfilled") {
      navigate(`/dashboard/${user?.role}/tickets`);
      window.scrollTo({ top: 0 });
    }
  }, [deleteResponse]);

  const [trigger, { data: tickets, isFetching, isError }] = useLazyReadQuery();

  useEffect(() => {
    trigger({
      url: `/user/tickets?_id=${id}&populate=user`,
      tag: ["tickets"],
    });
  }, [id]);

  useEffect(() => {
    if (tickets) {
      const data = tickets?.data[0];
      setTitle(data?.title ? data.title : title);
      setDescription(data?.description ? data.description : description);
      setStatus(data?.status ? data.status : status);
    }
  }, [tickets]);

  const updateHandler = () => {
    updateData({
      title,
      description,
      status,
      url: `/user/tickets?id=${id}`,
      tag: ["tickets"],
    });
  };

  useEffect(() => {
    if (updateResponse?.status === "fulfilled") {
      window.location.reload();
    }
  }, [updateResponse]);

  // pdf generator
  const licenseCertificatedRef = useRef(null);
  const handleGeneratePdf = async () => {
    const inputData = licenseCertificatedRef.current;
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a3",
      });

      pdf.html(inputData, {
        callback: function (pdf) {
          pdf.save("tickets.pdf");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  //xlsx style sheet
  const handleXlsxGenerate = (ticket) => {
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(ticket);
    utils.book_append_sheet(wb, ws, "Ticket Sheet");
    writeFile(wb, "ticket.xlsx");
  };

  return (
    <div>
      <Response response={updateResponse} setPending={setCreatePending} />
      <Response response={deleteResponse} setPending={setDeletePending} />
      <div class=" dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg shadow-lg px-5 py-10 w-full md:w-[90%] md:px-main mx-auto">
        <div className="w-full flex items-center justify-between gap-2 my-2">
          <p
            className="text-lg font-bold mb-3 under
          "
          >
            Update Your Ticket
          </p>
          <p> No. {tickets?.data[0]?.ticketId}</p>
        </div>
        <div class="flex flex-col md:flex-row items-start gap-2 justify-between mb-8">
          <div class="flex w-full flex-col">
            <div class="text-sm mb-2">Title</div>

            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Title"
              className="w-full bg-dark h-12 p-2.5 px-2 rounded-lg border"
            />
          </div>
        </div>
        <div class="border-b-2 border-gray-300 pb-8 mb-8">
          <div class=" border-gray-300 pb-4 mb-5">
            <div class="flex w-full mb-2 flex-col">
              <div class="text-sm mb-2">Description</div>

              <textarea
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                value={description}
                className="w-full bg-dark h-40 p-3 px-2 rounded-lg border resize-none"
              ></textarea>
            </div>
          </div>
          {user?.role === "admin" ? (
            <div class=" border-gray-300 pb-4 mb-5">
              <div class="flex w-full mb-2 flex-col">
                <div class="text-sm mb-2">Status</div>
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-dark h-12 p-2.5 px-2 rounded-lg border"
                  value={status}
                  name=""
                  id=""
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          ) : (
            <p className="w-full bg-dark h-12 p-2.5 px-2 rounded-lg border">
              {status}
            </p>
          )}
        </div>

        <div className="flex w-full items-center gap-3 justify-between">
          <LoadingButton
            pending={createPending}
            onClick={updateHandler}
            title="Update"
            color="bg-main"
            width="w-full"
          />{" "}
          <button
            onClick={handleGeneratePdf}
            className="px-3 py-2 flex gap-1 items-center bg-red-500 text-white rounded-lg"
          >
            <svg
              class="w-5 h-5"
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
                d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"
              />
            </svg>
            Pdf
          </button>
          <button
            onClick={() => handleXlsxGenerate([tickets?.data[0]])}
            className="px-3 flex items-center gap-1 py-2 bg-emerald-500 text-white rounded-lg"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5c.07 0 .14-.007.207-.021.095.014.193.021.293.021h2a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2v11h-2V5a2 2 0 0 0-2-2H5Zm7 4a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm-6 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1ZM7 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7Zm1 3V8h1v1H8Z"
                clip-rule="evenodd"
              />
            </svg>
            xlsx
          </button>
          <button
            onClick={() => {
              setPopup(true);
            }}
            className="px-3 py-2 flex gap-1 items-center bg-pink-400 text-white rounded-lg"
          >
            <DeleteIcon fontSize="small" />{" "}
            <p className="hidden lg:block">delete</p>
          </button>
        </div>
      </div>
      {popup && (
        <Pop
          content="Are you sure you want to remove this ticket?"
          cancel={setPopup}
          trigger={
            <LoadingButton
              pending={deletePending}
              onClick={deleteHandler}
              title="Yes, I'm Sure"
              color="bg-main"
              width="w-36 sm:rounded-lg sm:border sm:py-2 sm:px-5 sm:hover:bg-red-500"
            />
          }
        />
      )}

      <div
        ref={licenseCertificatedRef}
        class="w-full relative bg-white border mt-6 my-4 md:w-[90%] md:px-main mx-auto rounded-xl shadow-sm"
        id="ticket"
      >
        <div className="w-full relative flex rounded-xl rounded-b-none text-white items-center justify-between gap-2 bg-main px-5 py-4">
          <div className="flex items-center justify-between gap-10">
            <p className="text-2xl font-extrabold uppercase">Your Ticket</p>
            <img src="/logo.png" alt="logo" className="h-8 w-16 rounded-sm" />
          </div>{" "}
          <div className="text-xs flex items-end flex-col gap-1 absolute bottom-1 right-4 uppercase italic font-light">
            <img
              src={tickets?.data[0]?.user?.profilePicture}
              alt="qrcode"
              className="w-7 h-7 rounded-full"
            />{" "}
            <p>
              {tickets?.data[0]?.user?.firstName}{" "}
              {tickets?.data[0]?.user?.lastName}
            </p>
          </div>
        </div>

        <div className="w-[350px] mt-32 -ml-36 rotate-[90deg] px-4 py-4 h-full ">
          <img
            src={tickets?.data[0]?.barcode}
            alt="barcode"
            className="w-full"
          />
        </div>

        <div className="-mt-48 w-full h-full flex flex-col gap-5 lg:gap-0 lg:flex-row left-32d">
          <div className="ml-20 lg:ml-32 p-2 pr-4 flex-col gap-3 flex w-full lg:flex-[60%]">
            <p className="text-lg">{tickets?.data[0]?.ticketId}</p>
            <p className="text-xl text-main uppercase">
              {tickets?.data[0]?.title}
            </p>
            <p className="w-[250px] lg:w-full">
              {tickets?.data[0]?.description}
            </p>
            <p className="text-sm self-end mr-20 lg:mr-0 font-bold">
              {new Date(tickets?.data[0]?.createdAt)?.toDateString()}
            </p>
          </div>

          <div className="bg-red-100 pr-4 flex gap-3 flex-col rounded-lg p-2 w-full lg:flex-[40%]">
            <div className="flex text-right items-center justify-end gap-4">
              <p>First Name</p>
              <p className="text-sm font-bold text-right">
                {tickets?.data[0]?.user?.firstName}
              </p>
            </div>
            <div className="flex text-right items-center justify-end gap-4">
              <p>Last Name</p>
              <p className="text-sm font-bold text-right">
                {tickets?.data[0]?.user?.lastName}
              </p>
            </div>{" "}
            <div className="flex text-right items-center justify-end gap-4">
              <p>Email</p>
              <p className="text-sm font-bold text-right">
                {tickets?.data[0]?.user?.email}
              </p>
            </div>{" "}
            <div className="w-full flex items-center justify-center h-56">
              <img
                src={tickets?.data[0]?.qrCode}
                alt="qrcode"
                className="w-44 h-44"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsDetail;
