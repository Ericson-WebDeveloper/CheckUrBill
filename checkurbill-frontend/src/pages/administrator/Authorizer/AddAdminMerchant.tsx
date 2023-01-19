import React from "react";
import { useParams } from "react-router-dom";

type AddAdminMerchantProps = {};

const AddAdminMerchant = (props: AddAdminMerchantProps) => {
  // only Authorizer
  const { merchant_code } = useParams();

  return <div>AddAdminMerchant</div>;
};

export default AddAdminMerchant;
