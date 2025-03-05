import React, { useEffect, useRef, useState } from "react";
import {
  useUpdateMutation,
  useLazyReadQuery,
  useDeleteMutation,
} from "./../features/api/apiSlice";
import jsPDF from "jspdf";
import { utils, writeFile } from "xlsx";
import Loading from "./loading/Loading";

const SingleTicket = () => {
  const id = location?.search?.split("?ticketId=")[1];
  const [deleteData, deleteResponse] = useDeleteMutation();

  useEffect(() => {
    if (deleteResponse?.status === "fulfilled") {
      navigate(`/dashboard/${user?.role}/tickets`);
      window.scrollTo({ top: 0 });
    }
  }, [deleteResponse]);

  const [trigger, { data: tickets, isFetching, isError }] = useLazyReadQuery();

  useEffect(() => {
    trigger({
      url: `/user/tickets?ticketId=${id}&populate=user`,
      tag: ["tickets"],
    });
  }, [id]);

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
    <div className="w-full h gap-3 bg-gray-200 h-[120vh] flex items-center justify-center">
      <div className="mt-20">
        {!isFetching && tickets && tickets?.data ? (
          <>
            <div
              ref={licenseCertificatedRef}
              class="w-full relative bg-white border mt-6 my-4 md:w-[90%] md:px-main mx-auto rounded-xl shadow-sm"
              id="ticket"
            >
              <div className="w-full relative flex rounded-xl rounded-b-none text-white items-center justify-between gap-2 bg-main px-5 py-4">
                <div className="flex items-center justify-between gap-10">
                  <p className="text-2xl font-extrabold uppercase">
                    Your Ticket
                  </p>
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="h-8 w-16 rounded-sm"
                  />
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

              <div className="absoluted -mt-48 w-full h-full flex flex-1 left-32d">
                <div className=" ml-32 p-2 pr-4 flex-col gap-3 flex flex-[60%]">
                  <p className="text-lg">{tickets?.data[0]?.ticketId}</p>
                  <p className="text-xl text-main uppercase">
                    {tickets?.data[0]?.title}
                  </p>
                  <p className="">{tickets?.data[0]?.description}</p>
                  <p className="text-sm self-end font-bold">
                    {new Date(tickets?.data[0]?.createdAt)?.toDateString()}
                  </p>
                </div>

                <div className="bg-red-100 pr-4 flex gap-3 flex-col rounded-lg p-2 flex-[40%]">
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
            <div class=" dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg shadow-lg px-5 py-10 w-full md:w-[90%] md:px-main mx-auto">
              <div className="flex w-full items-center gap-3 justify-between">
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
                  Spreed Sheet
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-[100vh] flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleTicket;
