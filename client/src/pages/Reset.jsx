import React, { useState } from "react";
import LoadingButton from "../components/loading/LoadingButton";
import { useResetPasswordMutation } from "../features/api/apiSlice";
import Response from "../components/Response";
import { useLocation } from "react-router";

const Reset = () => {
  const resetToken = useLocation().search.split("?")[1];
  const [resetData, resetResponse] = useResetPasswordMutation();
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetHandler = () => {
    resetData({ password, confirmPassword, resetToken });
  };

  return (
    <div className="w-full gap-3 bg-gray-200 h-[100vh] flex items-center justify-center">
      <Response
        response={resetResponse}
        setPending={setPending}
        type="reset"
        redirectTo="/"
      />
      <div class="w-full lg:w-auto h-auto shadow-lg flex flex-col border rounded-lg p-10 items-start justify-start bg-white">
        {" "}
        <p className="text-xl font-bold">Forget</p>
        <p className="mt-2">
          Please insert the email that we have sent in your email.
        </p>
        <div class="mb-2 mt-4">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            New Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            class="shadow-sm  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500 dark:shadow-sm-light"
            placeholder="new password"
            required
          />
        </div>
        <div class="mb-5 mt-4">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            id="password"
            class="shadow-sm  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500 dark:shadow-sm-light"
            placeholder="confirm password"
            required
          />
        </div>
        <LoadingButton
          pending={pending}
          onClick={resetHandler}
          title="Next"
          color="bg-main"
          width="w-48"
        />
      </div>
    </div>
  );
};

export default Reset;
