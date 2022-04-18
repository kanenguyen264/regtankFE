import {
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { ReactComponent as SortIcon } from "@protego/sdk/assets/icons/IcoSort.svg";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { capitalizeFirst } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import { ReactComponent as RemoveIcon } from "assets/images/icons/RemoveIcon.svg";
import clsx from "clsx";
import Keyword from "components/Keywordv1";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import { get, isEmpty } from "lodash";
import React, { useState } from "react";
import { compose } from "recompose";
import { formatDate, LONG_DATE, TIME } from "util/date";
import styles from "./tableStyle.module.scss";

const DataTableHead = (props) => {
  const { list, ref, paginationParams, className } = props;
  const sort = paginationParams?.sort;

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  let order, orderBy;
  if (!isEmpty(sort)) {
    let sortType = sort.includes("asc");
    order = sortType ? "asc" : "desc";
    orderBy = sort ? sort.split(",")[0] : "";
  }
  return (
    <TableHead ref={ref}>
      <TableRow className={className}>
        {list.map(({ align, sort, index, name, width, label, rowCount }) => {
          if (sort || true) {
            return (
              <TableCell
                key={name}
                sortDirection={orderBy === name ? order : false}
                align={"left"}
              >
                {sort ? (
                  <Tooltip arrow title={"Sort"} enterDelay={300}>
                    <TableSortLabel
                      active={name === orderBy}
                      direction={name === orderBy ? order : "asc"}
                      onClick={createSortHandler(name)}
                      IconComponent={SortIcon}
                    >
                      <span>{label || capitalizeFirst(name)}</span>
                    </TableSortLabel>
                  </Tooltip>
                ) : (
                  <TableSortLabel
                    hideSortIcon={true}
                    active={false}
                    style={{ cursor: "auto" }}
                    IconComponent={SortIcon}
                  >
                    <span>{label}</span>
                  </TableSortLabel>
                )}
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
};
const KYCTableIndividual = compose(
  withStyles((them) => ({}), { name: "KYCTableIndividual" })
)(
  React.forwardRef(function KYCTable(props, ref) {
    const {
      onChangeRemark,
      onPressRemove,
      paginationParams,
      setPaginationParams,
      onChangeOfShare,
    } = props;

    const { data, options: _options } = props;
    const options = Object.assign(
      {
        selectable: true,
        selections: null,
        onSelected: null,
        pagination: true,
        renderEmpty: false,
        checkHighlight: null,
        enableCollapsibleCell: false,
        renderCollapse: null,
        disableTableHead: false,
        scrollable: false,
        disableShowing: true,
      },
      _options
    );
    const tableHeadRef = React.useRef();

    const [selected, setSelected] = useState([]);
    options.selections = options.selections || selected;
    options.onSelected = options.onSelected || setSelected;

    const handleRequestSort = (e, property) => {
      const sort = paginationParams?.sort;
      let sortType = isEmpty(sort) ? "" : sort.includes("asc");
      setPaginationParams?.(
        {
          sort: `${property},${sortType ? "desc" : "asc"}`,
        },
        "replaceIn"
      );
    };

    const columnData = [
      {
        name: "kycId",
        label: <IntlMessages id="kyc.kycId" />,
        sort: true,
        align: "left",
        className: styles.wId,
      },
      {
        name: "individualRiskScore",
        sort: true,
        align: "center",
        className: styles.wRiskScore,
        label: <IntlMessages id="risk-score" />,
      },
      {
        name: "individualRequest.name",
        sort: true,
        className: styles.wName,
        style: { wordBreak: "break-all" },
        label: <IntlMessages id="name" />,
      },
      {
        name: "percentOfShare",
        sort: true,
        className: styles.wPosition,
        label: <IntlMessages id="kyb.table.ofShare" />,
        align: "left",
      },
      {
        name: "keywords",
        label: <IntlMessages id="keywords" />,
        align: "left",
        sort: false,
        className: styles.wKeyword,
      },
      {
        name: "remarks",
        sort: false,
        label: <IntlMessages id="kyb.table.Remarks" />,
        align: "left",
        className: styles.wPosition,
      },
      {
        name: "updatedAt",
        label: <IntlMessages id="last-modified-by" />,
        sort: true,
        className: styles.width145,
      },
      {
        name: "remove",
        label: "",
        sort: false,
        align: "left",
        className: styles.width30,
      },
    ];
    return (
      <div className={clsx(styles.tableWrapper, "mt-3")}>
        <Table>
          <DataTableHead
            paginationParams={paginationParams}
            ref={tableHeadRef}
            list={columnData}
            onRequestSort={handleRequestSort}
            rowCount={data.records?.length}
            options={options}
          />
          <TableBody>
            {data?.map((val) => {
              const risk = get(val.individualRiskScore, "risk");
              const riskLevel = get(val.individualRiskScore, "riskLevel");
              const isSan = get(val.individualRiskScore, "isSanction");
              const numberOfChanges = get(
                val.individualRiskScore,
                "numberOfChanges"
              );
              return (
                <TableRow>
                  <TableCell className={styles.wId}>
                    <div className={clsx(styles.Link, styles.Ids, "d-flex")}>
                      <CopyButton
                        component={"span"}
                        copyIcon={
                          <SvgIcon component={CopyIcon} viewBox="0 0 18 16" />
                        }
                      >
                        <Link
                          to={`/app/screen-kyc/result/${val?.kycId}${
                            val?.status === "COMPLETED" ? "/scoring" : ""
                          }`}
                          target={"_blank"}
                        >
                          {val?.kycId}
                        </Link>
                      </CopyButton>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RiskRatingLabel
                      size="small"
                      type={isSan ? "San" : ""}
                      level={riskLevel}
                      value={risk}
                      numberOfChanges={numberOfChanges}
                    />
                  </TableCell>
                  <TableCell className={styles.wName}>
                    {val.individualRequest.name}
                  </TableCell>
                  <TableCell className={styles.wPercentOfShare}>
                    <TextField
                      variant={"outlined"}
                      placeholder={"%"}
                      inputProps={{
                        min: 0,
                        maxLength: 6,
                        style: { textAlign: "left" },
                      }}
                      value={val.percentOfShare ? val.percentOfShare : ""}
                      onChange={(e) =>
                        onChangeOfShare(e.target.value, val.kycId)
                      }
                    />
                  </TableCell>
                  <TableCell className={styles.wKeyword}>
                    <Keyword keywords={val?.keywords} />
                  </TableCell>

                  <TableCell className={styles.wPosition}>
                    <Tooltip
                      placement={"top-start"}
                      disableFocusListener={
                        val?.remarks?.length > 0 ? false : true
                      }
                      title={
                        <Typography variant="body1">{val?.remarks} </Typography>
                      }
                      arrow
                    >
                      <TextField
                        variant={"outlined"}
                        fullWidth
                        style={{ marginBottom: 0 }}
                        value={val?.remarks ? val.remarks : ""}
                        className={styles.textRemarks}
                        onChange={(e) =>
                          onChangeRemark(e.target.value, val.kycId, data)
                        }
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Nullable
                      component={UserAvatar}
                      user={val.lastModifiedBy}
                      valueProp={"user"}
                      description={
                        <Typography variant="smallGrayDefault">
                          <div className="d-flex flex-column">
                            <div className="d-flex flex-column">
                              <div>{formatDate(val.updatedAt, LONG_DATE)}</div>
                              <div>{formatDate(val.updatedAt, TIME)}</div>
                            </div>
                          </div>
                        </Typography>
                      }
                    >
                      <Typography>{val.lastModifiedBy}</Typography>
                    </Nullable>
                  </TableCell>
                  <TableCell className={styles.width30}>
                    <div>
                      <span
                        className={clsx(
                          styles.Link,
                          styles.CopyIconHover,
                          "d-flex align-items-center"
                        )}
                        onClick={() => onPressRemove(val.kycId)}
                      >
                        <RemoveIcon />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  })
);

export default KYCTableIndividual;
