import React, { useState } from "react";
import LoadingButton from "../components/loading/LoadingButton";
import { useForgetPasswordMutation } from "../features/api/apiSlice";
import Response from "../components/Response";

const Forget = () => {
  const [forgetData, forgetResponse] = useForgetPasswordMutation();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");

  const forgetHandler = () => {
    forgetData({ email });
  };

  return (
    <div className="w-full bg-white h-[100vh] px-main flex flex-col items-center justify-center">
      <Response
        response={forgetResponse}
        setPending={setPending}
        type="forget"
      />
      <div className="w-full lg:w-auto h-auto shadow-lg flex flex-col border rounded-lg p-10 items-start justify-start bg-white">
        {" "}
        <p className="text-xl font-bold">Forget</p>
        <p className="mt-2">
          Please insert the email that used before to register in ticket
          management system.
        </p>
        <div class="mb-5 mt-4">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            class="shadow-sm  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500 dark:shadow-sm-light"
            placeholder="gedeonagmas2580@gmail.com"
            required
          />
        </div>
        <LoadingButton
          pending={pending}
          onClick={forgetHandler}
          title="Next"
          color="bg-main"
          width="w-48"
        />
      </div>
    </div>
  );
};

export default Forget;
