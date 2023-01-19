import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import OnBoardMerchant from "../../components/modals/administrator/OnBoardMerchant";
import { motion } from "framer-motion";
import { useGetMerchantListsQuery } from "../../services/administrator-service";
import {
  useCategoriesQuery,
  useInstitutionsQuery,
  useTypesQuery,
} from "../../services/helper-service";
import Spinner from "../../components/modals/Spinner";
import MerchantTable from "../../components/tables/administrator/MerchantTable";
import { useAppSelector, useAppDispatch } from "../../feature/store";
import { have } from "../../helpers/can";
import UpdateMerchantApiUrl from "../../components/modals/administrator/UpdateMerchantApiUrl";
import UpdateMerchantInfo from "../../components/modals/administrator/UpdateMerchantInfo";
import ActivateMerchant from "../../components/modals/administrator/ActivateMerchant";
import { useFetchMerchantQuery } from "../../services/merchant-service";
import { toast } from "react-toastify";
import { fetchMerchant } from "../../feature/merchant/merchantAction";
import Paginate from "../../components/pagination/Paginate";
import OnBoardMerchantAdmin from "../../components/modals/administrator/OnBoardMerchantAdmin";

type MerchantsProps = {};

const Merchants = (props: MerchantsProps) => {
  const [modalBoardMerchant, setModalBoardMerchant] = useState<boolean>(false);
  const [modalEditAPiUrl, setModalEditAPiUrl] = useState<boolean>(false);
  const [modalEditInfo, setModalEditInfo] = useState<boolean>(false);
  const [modalActivateMerchant, setActivateMerchantModal] =
    useState<boolean>(false);
    const [modalCreateAdminMerchant, setCreateAdminMerchantModal] =
    useState<boolean>(false);

  const [merchantCode, setMerchantCode] = useState<string>("");
  const dispatch = useAppDispatch();
  const [getPage] = useSearchParams();

  const { data: merchants, isLoading } = useGetMerchantListsQuery(
    {search: getPage.get("search"), page: getPage.get("page")}
  );
  const { data: institutions, isLoading: Iloading } = useInstitutionsQuery();
  const { data: categories, isLoading: Cloading } = useCategoriesQuery();
  const { data: types, isLoading: Tloading } = useTypesQuery();
  const { userAuth } = useAppSelector((state) => state.auth);
  const {
    merchant,
    isError,
    isLoading: fetchMerchantLoading,
    error,
  } = useAppSelector((state) => state.merchant);
  // const {data, isLoading: fetchingMerchantLoading, isError: ErrorFechingMerchant, error} = useFetchMerchantQuery(merchantCode, {
  //   skip: merchantCode === ''
  // });

  const setFetchingMerchantAPI = async (
    open: boolean,
    merchant_code: string = ""
  ): Promise<void> => {
    if (open && merchant_code !== "") {
      setModalEditAPiUrl(open);
      // setMerchantCode(merchant_code)
      await dispatch(fetchMerchant(merchant_code));
    } else {
      setModalEditAPiUrl(open);
      // setMerchantCode('')
    }
  };

  const setFetchingMerchantData = async (
    open: boolean,
    merchant_code: string = ""
  ): Promise<void> => {
    if(merchant_code !== "") {
      await dispatch(fetchMerchant(merchant_code));
    }
    setModalEditInfo(open);
  };

  const setFetchingMerchantActivate = async (
    open: boolean,
    merchant_code: string = ""
  ): Promise<void> => {
    if(merchant_code !== "") {
      await dispatch(fetchMerchant(merchant_code));
    }
    setActivateMerchantModal(open);
  };

  const setFetchingMerchantAdminCreate = async (
    open: boolean,
    merchant_code: string = ""
  ): Promise<void> => {
    if(merchant_code !== '') {
      await dispatch(fetchMerchant(merchant_code));
    }
    setCreateAdminMerchantModal(open);
  };

  if (isLoading || Iloading || Cloading || Tloading || fetchMerchantLoading) {
    return <Spinner />;
  }
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="w-full h-[80vh]"
    >
      <div className="flex flex-col mb-14">
        <span className="flex flex-col md:flex-row justify-start space-x-2">
          <h1 className="text-4xl font-serif font-semibold">Merchant's List</h1>

          {/* Uploader only */}
          {have(userAuth?.permissions!, ["uploader"]) ? (
            <button
              onClick={() => setModalBoardMerchant(!modalBoardMerchant)}
              type="button"
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 
          focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 
          dark:focus:ring-purple-900"
              data-modal-toggle="boardmerchantmodal"
            >
              On Board Merchant
            </button>
          ) : null}
        </span>
        {/* view, view users, activate/deactivate, update details except merchant ref -> authorizer only here */}
        {/* uploader & admin only see the list */}
        {/* admin -> view, view users, */}
        {/* button for creating Admin of Merchant newly On Board only for authorizer 
        and. after approve merchnat redirect to add merchant admin */}
        <div className="overflow-x-auto mb-8">
          <MerchantTable
            datas={merchants?.data?.data || null}
            setFetchingMerchantAPI={setFetchingMerchantAPI}
            setModalEditInfo={setFetchingMerchantData}
            setActivateMerchantModal={setFetchingMerchantActivate}
            setCreateAdminMerchantModal={setFetchingMerchantAdminCreate}
          />
        </div>
        <div className="flex justify-end items-center mb-4">
          {merchants && merchants?.data?.data?.length! > 0 ? (
            <Paginate
              currentPage={merchants?.data?.current_page!}
              prev_page_url={merchants?.data?.prev_page_url!}
              next_page_url={merchants?.data?.next_page_url!}
            />
          ) : null}
        </div>
      </div>
      <div className="mx-auto">
        <OnBoardMerchant
          institutions={institutions?.data ? institutions?.data : null}
          categories={categories?.data || null}
          types={types?.data || null}
          modalBoardMerchant={modalBoardMerchant}
          setModalBoardMerchant={setModalBoardMerchant}
        />
        <UpdateMerchantApiUrl
          modalEditAPiUrl={modalEditAPiUrl}
          setFetchingMerchantAPI={setFetchingMerchantAPI}
          merchant={merchant}
        />
        <UpdateMerchantInfo
          modalMerchantUpdateInfo={modalEditInfo}
          setModalEditInfo={setFetchingMerchantData}
          merchant={merchant}
        />
        <ActivateMerchant
          modalActivateMerchant={modalActivateMerchant}
          setActivateMerchantModal={setFetchingMerchantActivate}
          merchant={merchant}
        />
        <OnBoardMerchantAdmin modalCreateAdminMerchant={modalCreateAdminMerchant} setCreateAdminMerchantModal={setFetchingMerchantAdminCreate} 
        merchant={merchant} />
      </div>
    </motion.div>
  );
};

export default Merchants;
