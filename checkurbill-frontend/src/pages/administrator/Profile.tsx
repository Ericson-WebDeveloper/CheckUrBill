import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../../feature/store";
import { imageToBas64 } from "../../helpers/ImageBase64";
import { toast } from "react-toastify";
import { useUpdateAvatarUserMutation, useUpdateBasicInfoUserMutation } from "../../services/personal-service";
import Spinner from "../../components/modals/Spinner";
import { SET_USER_AUTH } from "../../feature/auth/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, UserInfo } from "../../models/User";
import { ErrorHandling } from "../../helpers/errorHandling";

export type UserProfileUpdateType = Pick<
  User,
  "firstname" | "lastname" | "middlename" | "email"
> &
  Pick<UserInfo, "gender" | "contact_no"> & {user_id:string};

const schema = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  middlename: yup.string().required(),
  email: yup.string().required().email(),
  gender: yup.string().required(),
  contact_no: yup.string().required(),
});

type ProfileProps = {};

const Profile = (props: ProfileProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const [image, setImage] = useState<null | string | ArrayBuffer>(null);
  const [updateAvatarUser, { isLoading }] = useUpdateAvatarUserMutation();
  const dispatch = useAppDispatch();
  const [updateBasicInfoUser, {isLoading: updateProfileLoading}] = useUpdateBasicInfoUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<UserProfileUpdateType>({
    resolver: yupResolver(schema),
  });

  const imageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    let types = e.target?.files![0].type.split("/");
    if (types[0] !== "image" || !["png", "jpeg", "jpg"].includes(types[1])) {
      toast.error(`File are invalid`, {
        theme: "dark",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return false;
    }
    imageToBas64(e.target, (image) => {
      setImage(image);
    });
  };

  const updateInfo: SubmitHandler<UserProfileUpdateType> = async (formdata) => {
    try {
      formdata ={
        ...formdata,
        user_id: userAuth?.id!,
      }
        let response = await updateBasicInfoUser(formdata).unwrap();
        dispatch(SET_USER_AUTH(response?.data!));
        reset();
        toast.success("Profile Info Updated Success");
    } catch (error: any) {
      ErrorHandling(error);
    }
  }

  const changeAvatar = async () => {
    try {
      const data = {
        user_id: userAuth?.id!,
        avatar: image as string,
      };
      let response = await updateAvatarUser(data).unwrap();
      dispatch(SET_USER_AUTH(response?.data!));
      setImage(null);
      toast.success("Avatar Change Success");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.error);
    }
  };

  if (isLoading || updateProfileLoading) {
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
        <div className="flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-2">
          <div className="h-full w-full lg:w-[40%] ">
            <div className="flex flex-col rounded-3xl h-[400px] p-2 px-2 pt-5 bg-[rgb(255,255,255)] space-y-3">
              <div className="flex justify-center lg:justify-start items-center w-full space-x-4">
                <img
                  src={`${
                    userAuth?.info?.avatar || "https://via.placeholder.com/30"
                  }`}
                  className="w-14 h-16"
                  alt="User Avatar"
                />
                <span className="flex flex-col">
                  <h1 className="font-semibold">{`${userAuth?.firstname} ${userAuth?.lastname}`}</h1>
                  <h4>Administartor/Admmin</h4>
                </span>
                <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
              </div>
              <h3 className="text-lg font-bold font-serif ml-12 lg:mr-0">
                Full Name:{" "}
                {`${userAuth?.firstname} ${userAuth?.middlename}. ${userAuth?.lastname}`}
              </h3>
              <h3 className="text-lg font-bold font-serif ml-12 lg:mr-0">
                Email: {userAuth?.email}
              </h3>
              <h3 className="text-lg font-bold font-serif ml-12 lg:mr-0">
                Gender: {userAuth?.info?.gender}
              </h3>
              <h3 className="text-lg font-bold font-serif ml-12 lg:mr-0">
                Contact No#: {userAuth?.info?.contact_no}
              </h3>
            </div>
          </div>
          <div className="flex flex-col w-full rounded-3xl p-6 bg-[rgb(255,255,255)]">
            <h2 className="text-xl font-mono font-semibold mb-12 lg:mb-6">
              Update Information
            </h2>
            <div className="flex flex-col-reverse items-center lg:items-start lg:flex-row w-full lg:space-x-2 space-y-0 lg:space-y-0">
              <div className="flex flex-col w-full lg:w-[65%] p-2">
                <form onSubmit={handleSubmit(updateInfo)}>
                  <div className="mb-6">
                    <label
                      htmlFor="firstname"
                      
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register('firstname')}
                      id="firstname"
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                      placeholder="john"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="lastname"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register('lastname')}
                      id="lastname"
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                      placeholder="doe"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="middlename"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Middle Name
                    </label>
                    <input
                      type="text"
                      {...register('middlename')}
                      id="middlename"
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                      placeholder="doe"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      id="email"
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                         "
                      placeholder="john.doe@company.com"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      CellPhone number (098776543211)
                    </label>
                    <input
                      type="tel"
                      {...register('contact_no')}
                      pattern="[0][0-9]{10}"
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder=" "
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <fieldset>
                      {/* <legend className="sr-only">Cou ntries</legend> */}
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Gender
                      </label>
                      <div className="flex items-center mb-4">
                        <input
                          id="country-option-1"
                          type="radio"
                          {...register('gender')}
                          value="Male"
                          className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 
                      dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="country-option-1"
                          className="block ml-2 text-sm font-medium text-gray-900 "
                        >
                          Male
                        </label>
                      </div>

                      <div className="flex items-center mb-4">
                        <input
                          id="country-option-2"
                          type="radio"
                          {...register('gender')}
                          value="Female"
                          className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 
                        dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="country-option-2"
                          className="block ml-2 text-sm font-medium text-gray-900 "
                        >
                          Female
                        </label>
                      </div>
                    </fieldset>
                  </div>

                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div className="flex flex-col w-[35%] space-y-2">
                <label htmlFor="avatar_input_edit" className="cursor-pointer">
                  <img
                    src={`${image || userAuth?.info?.avatar}`}
                    className="w-34 h-[450px] cursor-pointer"
                    alt=""
                  />
                </label>
                <input
                  type="file"
                  onChange={imageCapture}
                  id="avatar_input_edit"
                  className="hidden"
                />
                <button
                  onClick={changeAvatar}
                  type="submit"
                  className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 
                focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 
                mb-2"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>
        <div />
      </div>
    </motion.div>
  );
};

export default Profile;
