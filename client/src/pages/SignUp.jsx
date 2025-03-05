import LoadingButton from "../components/loading/LoadingButton";
import { useUserRegisterMutation } from "../features/api/apiSlice";
import Response from "../components/Response";
import { useState } from "react";

const SignUp = ({ type }) => {
  const [signupData, signupResponse] = useUserRegisterMutation();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signupHandler = () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("profilePicture", profilePicture);
    formData.append("role", type);
    formData.append("url", `/user/signup`);
    formData.append("tag", ["users"]);
    signupData(formData);
  };

  return (
    <section class="bg-gray-200 px-5 w-full h-autod pt-10 flex items-center justify-center dark:bg-gray-900">
      <Response
        response={signupResponse}
        setPending={setPending}
        type="signUp"
      />
      <div class="flex flex-col items-center justify-center px-6 py-2 mx-auto h-screen lg:py-0">
        <div class="w-auto bg-white px-5 mt-10 rounded-lg shadow dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="px-4 py-4">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign Up
            </h1>
            <a href="/" className="text-xl absolute left-5 top-2 font-bold">
              <svg
                class="w-6 h-6 text-white"
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
                  d="M5 12h14M5 12l4-4m-4 4 4 4"
                />
              </svg>
            </a>
            <div class="space-y-4 md:space-y-6 mt-4" action="#">
              <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3">
                <div className="w-full">
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    name="text"
                    id="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    placeholder="gedeon"
                    required=""
                  />
                </div>
                <div className="w-full">
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    name="password"
                    id="password"
                    placeholder="Agmas"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    required=""
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                  placeholder="gedeon@gmail.com"
                  required=""
                />
              </div>

              <div className="w-full">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  for="multiple_files"
                >
                  Profile Picture(optional)
                </label>
                <input
                  onChange={(e) => setProfilePicture(e.target.files)}
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="multiple_files"
                  type="file"
                />
              </div>
              <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3">
                <div className="w-full">
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="email"
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    placeholder="gedeon@gmail.com"
                    required=""
                  />
                </div>
                <div className="w-full">
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    required=""
                  />
                </div>
              </div>

              <LoadingButton
                pending={pending}
                onClick={signupHandler}
                title="Register"
                color="bg-red-500"
                width="w-full"
              />
              <p class="text-sm flex items-center justify-start gap-2 font-light text-gray-500 dark:text-gray-400">
                Already have an Account?{" "}
                <a
                  href="/login"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login
                </a>{" "}
                <a
                  href="/forget"
                  class="font-medium self-end ml-5 text-red-500 text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forget Password
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
