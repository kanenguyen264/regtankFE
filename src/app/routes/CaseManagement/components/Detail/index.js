import { CASE_MANAGEMENT_DETAIL_UPDATE } from "actions/CaseManagementAction";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import CaseHasNotBeenSaveDlg from "../CaseHasNotBeenSaveDlg";
import EditForm from "../EditForm";
import ViewDetail from "./ViewDetail";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const CaseDetailBlock = ({ className, caseDetail, ...props }) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [editMode, setEditMode] = useState(false);
  const formikCaseRef = useRef();
  const [openNotSaveDlg, setOpenNotSaveDlg] = React.useState(false);
  const dispatch = useDispatch();

  const handleEditButton = () => {
    setEditMode(true);
  };
  const handleCloseButton = () => {
    setEditMode(false);
  };
  const handleCheckButton = (formValues) => {
    const params = {
      data: formValues,
      caseId: caseDetail?.caseId,
    };
    dispatch(CASE_MANAGEMENT_DETAIL_UPDATE(params)).then((res) => {
      setEditMode(false);
    });
  };
  return (
      <>
        {!editMode && (
          <ViewDetail
            caseDetail={caseDetail}
            handleEditButton={handleEditButton}
            className={className}
            {...props}
          />
        )}
        {editMode && (
          <EditForm
            caseDetail={caseDetail}
            handleEditButton={handleEditButton}
            formikRef={formikCaseRef}
            onSubmit={handleCheckButton}
            onCancel={()=>{setOpenNotSaveDlg(true)}}
            style={{ marginRight: toRem(30) }}
            displayAssign={true}
            mode={"edit"}
          />
        )}
        <CaseHasNotBeenSaveDlg
          open={openNotSaveDlg}
          onClickCancel={() => {
            setOpenNotSaveDlg(false);
          }}
          onClickOk={() => {
            setEditMode(false);
            setOpenNotSaveDlg(false);
          }}
        />
      </>
  );
};

export default CaseDetailBlock;
