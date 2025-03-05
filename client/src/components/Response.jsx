import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Response = ({ response, setPending, redirectTo, type }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(true);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    response.status === "pending" ? setPending(true) : setPending(false);

    let dashboard = "#";
    if (response.status === "fulfilled") {
      setError(false);
      setSuccess(true);
      setSuccessMessage(response?.data?.message);
      setTimeout(
        () => {
          setSuccess(false);
        },
        type === "forget" ? 20000 : 6000
      );

      if (type === "login") {
        localStorage.setItem(
          "ticket_user",
          JSON.stringify(response?.data?.data)
        );
        navigate(`/dashboard/${response?.data?.data?.role}`);

        window.location.reload();
      }
      if (type === "signUp") {
        localStorage.setItem(
          "ticket_user",
          JSON.stringify(response?.data?.data)
        );
        navigate(`/dashboard/${response?.data?.data?.role}`);
        window.location.reload();
      }
      if (type === "update") {
        localStorage.setItem(
          "ticket_user",
          JSON.stringify({ ...response?.data?.data })
        );
        window.location.reload();
      } else if (type === "reset") {
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 3000);
      } else if (type === "logout") {
        localStorage.removeItem("ticket_user");
        navigate("/", { replace: true });
        window.location.reload();
      } else if (redirectTo && redirectTo?.length > 0) {
        navigate(redirectTo, {
          replace: true,
          state: { role: response?.data?.data?.role },
        });
      }
    }

    response.status === "rejected"
      ? (setError(true),
        setErrorMessage(
          typeof response?.error?.data?.message === "string"
            ? [response?.error?.data?.message]
            : response?.error?.data?.message
        ))
      : setError(false);
  }, [response]);

  return (
    <div>
      {error && errorMessage && (
        <div
          class="flex p-4 mb-4 max-w-xl z-50 shadow-xl fixed top-32 right-20 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <div>
            <div className="flex items-center justify-between py-2">
              <svg
                class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span class="sr-only">Danger</span>{" "}
              <p class="font-medium">
                Error Messages {"("}
                {errorMessage?.length}
                {")"}
              </p>
              <button
                type="button"
                onClick={() => setError(false)}
                class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-800 rounded-lg focus:ring-0 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                data-dismiss-target="#alert-2"
                aria-label="Close"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            <ul class="mt-1 list-disc list-inside">
              {errorMessage?.map((err, i) => {
                return <li key={i}>{err}</li>;
              })}
            </ul>
          </div>
        </div>
      )}

      {success && successMessage && (
        <div
          id="alert-3"
          class="flex items-start p-4 mb-4 fixed top-32 z-50 right-20 max-w-[400px] text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <svg
            class="w-6 h-6 text-green-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm13.7-1.3a1 1 0 0 0-1.4-1.4L11 12.6l-1.8-1.8a1 1 0 0 0-1.4 1.4l2.5 2.5c.4.4 1 .4 1.4 0l4-4Z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="sr-only">Info</span>
          <div class="ms-3 text-sm font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccess(false)}
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-0 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            data-dismiss-target="#alert-3"
            aria-label="Close"
          >
            <span class="sr-only">Close</span>
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Response;
