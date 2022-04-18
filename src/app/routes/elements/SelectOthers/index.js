import Select from "@protego/sdk/RegtankUI/v1/SelectOthers";
import React from "react";
import {KYB_KYC_DATA} from "constants/RelationshipProfile"

const SelectOthers = () => {
  return (
    <Select data={KYB_KYC_DATA} selected={"KYB_KYC_DIRECTOR"} />
  );
};

export default SelectOthers;
