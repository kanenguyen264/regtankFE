import { ExpandMore } from "@material-ui/icons";
import { Field } from "formik";
import moduleStyles from "../BlackListStyle.module.scss";
import React from "react";
import clsx from "clsx";
export const CAutoComplete = function CAutoComplete(props) {
  const {
    labelHeader,
    required,
    textLabelHelper,
    numberChip,
    labelIns="",
    multiple,
  } = props;

  return (
    <div className={moduleStyles.CAutoComplete}>
      <div className={"d-flex justify-content-between"}>
        {labelHeader && (
          <div className={clsx(moduleStyles.CAutoCompleteLabel, "d-flex justify-content-between w-100")}>
            <div>
              {" "}
              {labelHeader}{" "}
              {required && <span className={moduleStyles.textRequire}>*</span>}
              {}
            </div>
            {labelIns && <span>{labelIns}</span>}
          </div>
        )}
        {textLabelHelper && (
          <div>
            <span className={moduleStyles.textLabelHelper}>
              {textLabelHelper}
            </span>
          </div>
        )}
      </div>
      <div className={moduleStyles.inputLabel}>
        <Field
          {...props}
          type="select"
          multiple={multiple}
          //   className={className.customInput}
          popperFullWidth
          disableClearable
          popupIcon={<ExpandMore />}
          clearOnBlur
          textFieldProps={{
            fullWidth: true,
            variant: "outlined",
          }}
          numberChip={numberChip}
        />
      </div>
    </div>
  );
};
