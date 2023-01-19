import React from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../feature/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdatePasswordCredentialUserMutation } from "../../services/personal-service";
import Spinner from "../../components/modals/Spinner";
import { toast } from "react-toastify";
import { ErrorHandling } from "../../helpers/errorHandling";

export type PasswordUserUpdate = {
  old_password: string;
  new_password: string;
  confirm_password: string;
  user_id: string;
};

type ProfilePasswordProps = {};

const schema = yup.object({
  old_password: yup.string().required(),
  new_password: yup
    .string()
    .required()
    .min(6, "Password length should be at least 6 characters")
    .max(15, "Password cannot exceed more than 12 characters"),
  confirm_password: yup
    .string()
    .required()
    .oneOf([yup.ref("new_password")], "Passwords do not match"),
});

const ProfilePassword = (props: ProfilePasswordProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordUserUpdate>({
    resolver: yupResolver(schema),
  });
  const [updatePasswordCredentialUser, { isLoading }] =
    useUpdatePasswordCredentialUserMutation();

  const updatePasswordCredentials: SubmitHandler<PasswordUserUpdate> = async (
    formdata
  ) => {
    try {
      formdata = {
        ...formdata,
        user_id: userAuth?.id!,
      };
      await updatePasswordCredentialUser(formdata).unwrap();
      reset();
      toast.success("Password Credential Updated Success");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="w-full h-fit"
    >
      <div className="flex flex-col mb-2 space-y-4">
        <h1 className="text-4xl font-sans font-semibold space-x-2">
          Update Profile
        </h1>
        <div className="flex w-full space-y-2 lg:space-y-0 lg:space-x-2">
          <div className="flex flex-col w-full rounded-3xl p-6 bg-[rgb(255,255,255)]">
            <h2 className="text-xl font-mono font-semibold mb-12 lg:mb-6">
              Update Password
            </h2>
            <div className="flex flex-col-reverse items-center lg:items-start lg:flex-row w-full lg:space-x-2 space-y-0 lg:space-y-0">
              <div className="flex flex-col w-full lg:w-[65%] p-2">
                <form onSubmit={handleSubmit(updatePasswordCredentials)}>
                  <div className="mb-6">
                    <label
                      htmlFor="old_password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Old Password
                    </label>
                    <input
                      type="password"
                      id="old_password"
                      {...register("old_password")}
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                    />
                    <p className="text-red-600">
                      {errors?.old_password?.message}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="new_password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new_password"
                      {...register("new_password")}
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                    />
                    <p className="text-red-600">
                      {errors?.new_password?.message}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="confirm_password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      {...register("confirm_password")}
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                      
                    />
                    <p className="text-red-600">
                      {errors?.confirm_password?.message}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 
                focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 
                mb-2"
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div className="flex flex-col w-[35%] space-y-2">
                <img
                  src={`${
                    userAuth?.info?.avatar || "https://via.placeholder.com/30"
                  }`}
                  className="w-34 h-[450px]"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div />
      </div>
    </motion.div>
  );
};

export default ProfilePassword;
