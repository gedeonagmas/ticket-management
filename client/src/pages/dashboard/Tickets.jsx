import React, { useEffect, useRef, useState } from "react";
import LoadingButton from "../../components/loading/LoadingButton";
import {
  useDeleteMutation,
  useLazyReadQuery,
} from "../../features/api/apiSlice";
import Response from "../../components/Response";
import Loading from "../../components/loading/Loading";
import Pop from "../../components/Pop";
import ResponsivePagination from "react-responsive-pagination";
import "./../../assets/pagination.css";
import jsPDF from "jspdf";
import { utils, writeFile } from "xlsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowCircleRight } from "@mui/icons-material";

const Tickets = () => {
  const user = JSON.parse(localStorage.getItem("ticket_user"));
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(1);

  const [trigger, { data: tickets, isFetching, isError }] = useLazyReadQuery();

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    setTotalPage(Math.ceil(tickets?.total / 10));
  }, [tickets]);

  useEffect(() => {
    const fetchBy = user?.role === "user" ? `user=${user?._id}` : "";
    trigger({
      url: `/user/tickets?${fetchBy}&limit=10&page=${page}&searchField=title&searchValue=${search}&populate=user`,
      tag: ["tickets"],
    });
  }, [page, search]);
  const [deleteData, deleteResponse] = useDeleteMutation();
  const [deletePending, setDeletePending] = useState(false);

  const [popup, setPopup] = useState(false);
  const [id, setId] = useState("");
  const [ticket, setTicket] = useState("");
  const [value, setValue] = useState(true);

  const deleteHandler = () => {
    id &&
      deleteData({
        isActive: value,
        url: `/user/tickets?id=${id}`,
        tag: ["tickets"],
      });
  };

  useEffect(() => {
    if (tickets) {
      setTicket(tickets?.data[0]);
    }
  }, [tickets]);

  useEffect(() => {
    if (deleteResponse?.status === "fulfilled") {
      setPopup(false);
    }
  }, [deleteResponse]);

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
    <div className="flex px-[4%] min-h-[85vh] pb-5 relative bg-dark bg-white flex-col h-auto w-full gap-5">
      <Response response={deleteResponse} setPending={setDeletePending} />

      <div className="flex flex-col lg:flex-row items-center gap-5 justify-between">
        <div class="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 ">
          <label for="table-search" class="sr-only">
            Search
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
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
              type="text"
              id="table-search-users"
              class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for users"
            />
          </div>
        </div>
        <a
          href={`/dashboard/${user?.role}/tickets/create`}
          className="px-4 py-1.5 w-full lg:w-auto text-center bg-main text-white rounded-lg"
        >
          Create New
        </a>
      </div>
      <div className="w-full">
        {isFetching && <Loading />}
        {isError && <p>Something went wrong unable to read tickets data</p>}
        {tickets && tickets?.data?.length > 0 ? (
          <div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-2 py-3">
                      User
                    </th>
                    <th scope="col" class="px-2 hidden lg:block py-3">
                      Ticket Id
                    </th>
                    <th scope="col" class="px-2 py-3">
                      Status
                    </th>
                    <th scope="col" class="px-2 hidden lg:block py-3">
                      Created At
                    </th>
                    <th scope="col" class="px-2 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets?.data?.map((e) => {
                    return (
                      <tr
                        key={e?._id}
                        class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          class="flex items-center px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <img
                            class="w-8 h-8 rounded-full"
                            src={e?.user?.profilePicture}
                            alt="Gedi image"
                          />
                          <div class="ps-3 hidden lg:block">
                            <div class="text-sm font-semibold">
                              {e?.user?.firstName} {e?.user?.lastName}
                            </div>
                            <div class="font-normal text-xs text-gray-500">
                              {e?.user?.email}
                            </div>
                          </div>
                        </th>
                        <td class="px-2  text-sm py-4">
                          <div class=" hidden lg:block items-center">
                            {e?.ticketId}
                          </div>
                        </td>
                        <td class="px-2 py-4">
                          <div class="flex items-center">
                            <div
                              class={`h-2.5 w-2.5 rounded-full ${
                                e?.status === "Open"
                                  ? "bg-emerald-500"
                                  : e?.status === "In Progress"
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                              }  me-2`}
                            ></div>{" "}
                            {e?.status}
                          </div>
                        </td>
                        <td class="px-2 hidden lg:block py-4">
                          <div class="flex items-center">
                            <div
                              class={`h-2.5 w-2.5 rounded-full   me-2`}
                            ></div>{" "}
                            {new Date(e?.createdAt)?.toDateString()}
                          </div>
                        </td>
                        <td class="px-2 py-4">
                          <div className="flex gap-1 justify-between items-center">
                            <button
                              onClick={() => {
                                setId(e._id);
                                setPopup(true);
                              }}
                              className="px-1 py-1 flex gap-1 items-center w-7 bg-pink-400 text-white rounded-lg"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                            <button
                              onClick={() => {
                                setTicket(e);
                                handleGeneratePdf();
                              }}
                              className="px-1 py-1 flex gap-1 items-center w-16 bg-red-500 text-white rounded-lg"
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
                              PDF
                            </button>
                            <button
                              onClick={() => handleXlsxGenerate([e])}
                              className="px-1 flex items-center gap-1 py-1 w-16 bg-emerald-500 text-white rounded-lg"
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
                              XLSX
                            </button>
                            <a
                              href={`/dashboard/${user?.role}/tickets/detail?id=${e?._id}`}
                              className="px-1 flex items-center gap-1 py-1 w-20 bg-yellow-400 text-white rounded-lg"
                            >
                              Detail
                              <ArrowCircleRight />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="py-10">
              <ResponsivePagination
                total={totalPage}
                current={page}
                onPageChange={(currentPage) => setPage(currentPage)}
                previousLabel="Previous"
                previousClassName="w-24"
                nextClassName="w-24"
                nextLabel="Next"
              />
            </div>
          </div>
        ) : (tickets && tickets?.message) || tickets?.data?.length === 0 ? (
          <div>There is no data to display.</div>
        ) : null}
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
        class="w-full relative bg-white border rounded-xl shadow-sm my-2"
        id="ticket"
      >
        <div className="w-full relative flex rounded-xl rounded-b-none text-white items-center justify-between gap-2 bg-main px-5 py-4">
          <div className="flex items-center justify-between gap-10">
            <p className="text-2xl font-extrabold uppercase">Your Ticket</p>
            <img src="/logo.png" alt="logo" className="h-8 w-16 rounded-sm" />
          </div>{" "}
          <div className="text-xs flex items-end flex-col gap-1 absolute bottom-1 right-4 uppercase italic font-light">
            <img
              src={ticket?.user?.profilePicture}
              alt="qrcode"
              className="w-7 h-7 rounded-full"
            />{" "}
            <p>
              {ticket?.user?.firstName} {ticket?.user?.lastName}
            </p>
          </div>
        </div>

        <div className="w-[350px] mt-32 -ml-36 rotate-[90deg] px-4 py-4 h-full ">
          <img src={ticket?.barcode} alt="barcode" className="w-full" />
        </div>

        <div className="-mt-48 w-full h-full flex flex-col gap-5 lg:gap-0 lg:flex-row left-32d">
          <div className="ml-20 lg:ml-32 p-2 pr-4 flex-col gap-3 flex w-full lg:flex-[60%]">
            <p className="text-lg">{ticket?.ticketId}</p>
            <p className="text-xl text-main uppercase">{ticket?.title}</p>
            <p className="w-[250px] lg:w-full">{ticket?.description}</p>
            <p className="text-sm self-end mr-20 lg:mr-0 font-bold">
              {new Date(ticket?.createdAt)?.toDateString()}
            </p>
          </div>

          <div className="bg-red-100 pr-4 flex gap-3 flex-col rounded-lg p-2 w-full lg:flex-[40%]">
            <div className="flex text-right items-center justify-end gap-4">
              <p>First Name</p>
              <p className="text-sm font-bold text-right">
                {ticket?.user?.firstName}
              </p>
            </div>
            <div className="flex text-right items-center justify-end gap-4">
              <p>Last Name</p>
              <p className="text-sm font-bold text-right">
                {ticket?.user?.lastName}
              </p>
            </div>{" "}
            <div className="flex text-right items-center justify-end gap-4">
              <p>Email</p>
              <p className="text-sm font-bold text-right">
                {ticket?.user?.email}
              </p>
            </div>{" "}
            <div className="w-full flex items-center justify-center h-56">
              <img src={ticket?.qrCode} alt="qrcode" className="w-44 h-44" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
