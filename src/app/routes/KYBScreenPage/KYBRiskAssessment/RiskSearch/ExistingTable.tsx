import { Button } from "@material-ui/core";
import { PageResult } from "@protego/sdk/types";
import CustomTable from "@protego/sdk/UI/CustomTable/CustomTable";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Link from "@protego/sdk/UI/Link/Link";
import Nullable from "@protego/sdk/UI/Nullable/index";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import Keyword from "components/Keyword";
import RiskRatingLabel from "components/RiskRatingLabel";
import UserAvatar from "components/UserAvatar";
import { BUSINESS } from "constants/routes";
import { get } from "lodash";
import React, { FunctionComponent } from "react";
import {
  KybSimplifiedRequestDto,
  KycSimplifiedRequestDto
} from "types/typings-api";
import { formatDate, LONG_DATE_TIME } from "util/date";
//@ts-ignore
import styles from "../KYBRiskAssessment.module.scss";
interface ExistingTableProps {
  data: PageResult<KycSimplifiedRequestDto>;
  dataKYB: PageResult<KybSimplifiedRequestDto>;
  onAddItemToArchiveList: (idItemList: string[]) => void;
  onChangeDropdown: void;
  onPressAdd: (idItemList: any) => void;
  page: string;
  selectedValue: string;
  tab: string;
}

const ExistingTable: FunctionComponent<ExistingTableProps> = ({
  tab,
  data,
  onAddItemToArchiveList,
  onChangeDropdown,
  selectedValue,
  onPressAdd,
  page,
  dataKYB
}) => {
  if (page === BUSINESS) {
    /**
     * Return KYB table
     */
    return (
      <CustomTable<KybSimplifiedRequestDto>
        //@ts-ignore
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />
        }}
        options={{
          pagination: dataKYB?.records.length > 0 ? true : false,
          selectable: false
        }}
        columnData={{
          kybId: {
            label: <IntlMessages id="kyb.kybId" />,
            sort: false,
            align: "left",
            renderCell: (v, { status }) => {
              return (
                <div>
                  <Link
                    to={`/app/screen-kyb/result/${v}${
                      status === "COMPLETED" ? "/riskAssessment" : ""
                    }`}
                    target={"_blank"}
                  >
                    {v}
                  </Link>
                </div>
              );
            }
          },
          riskLevel: {
            sort: false,
            align: "center",
            style: { wordBreak: "break-all" },
            className: styles.width115,
            label: <IntlMessages id="risk-level" />,
            //@ts-ignore
            renderCell: (v, { countRiskLevelChange }) => {
              return (
                <RiskRatingLabel
                  level={v}
                  size="small"
                  value={v?.split("", 1) ? v?.split("", 1) : 0}
                  showLevel
                  numberOfChanges={countRiskLevelChange}
                />
              );
            }
          },
          businessName: {
            sort: false,
            className: styles.width140,

            style: { wordBreak: "break-all" },
            label: <IntlMessages id="result.Table.BusinessName" />
          },
          dateOfIncorporation: {
            sort: false,
            align: "center",
            className: styles.width140,
            label: <IntlMessages id="form.dateOfIncorporation" />,
            renderCell: (v) => (
              <div className={"flex-center"}>
                <Nullable>{formatDate(v)}</Nullable>
              </div>
            )
          },
          countryOfIncorporation: {
            sort: false,
            className: styles.with190,
            label: <IntlMessages id="kyb.table.header.countryOf" />,
            align: "center",
            renderCell: (v) => (
              <Nullable
                component={CountryFlagLanguage}
                demonym
                valueProp={"countryCode"}
                svg
              >
                {v}
              </Nullable>
            )
          },
          keywords: {
            label: <IntlMessages id="keywords" />,
            align: "center",
            className: styles.width140,
            sort: false,
            renderCell: (v) => {
              return <Keyword keywords={v} />;
            }
          },
          updatedAt: {
            label: <IntlMessages id="last-modified-by" />,
            sort: false,
            className: styles.width160,
            renderCell: (v, { lastModifiedBy }) => (
              <div className={"d-flex align-items-center"}>
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  description={formatDate(v, LONG_DATE_TIME)}
                >
                  {lastModifiedBy}
                </Nullable>
              </div>
            )
          },
          add: {
            sort: false,
            label: "",
            className: styles.width30,
            renderCell: (v, rowData) => (
              <div className={"d-flex align-items-center"}>
                <Button
                  size={"small"}
                  variant={"contained"}
                  disabled={v}
                  color={"primary"}
                  fullWidth
                  onClick={() => onPressAdd(rowData)}
                >
                  <IntlMessages id="kyb.table.add" />
                </Button>
              </div>
            )
          }
        }}
        data={dataKYB}
      />
    );
  }
  return (
    <CustomTable<KycSimplifiedRequestDto>
      //@ts-ignore
      lang={{
        rowsPerPage: <IntlMessages id={"appModule.table.footer"} />
      }}
      options={{
        selectable: false,
        pagination: data?.records.length > 0 ? true : false
      }}
      columnData={{
        kycId: {
          label: <IntlMessages id="kyc.kycId" />,
          sort: false,
          align: "left",
          renderCell: (v, { status }) => {
            return (
              <div
                className={clsx(
                  styles.Link,
                  styles.Ids,
                  "d-flex align-items-center"
                )}
              >
                <div>
                  <Link
                    to={`/app/screen-kyc/result/${v}${
                      status === "COMPLETED" ? "/scoring" : ""
                    }`}
                    target={"_blank"}
                  >
                    {v}
                  </Link>
                </div>
              </div>
            );
          }
        },
        "individualRiskScore.sortableRisk": {
          sort: false,
          align: "center",
          style: { wordBreak: "break-all" },
          className: styles.width115,
          label: <IntlMessages id="risk-score" />,
          renderCell: (v, { individualRiskScore }) => {
            const risk = get(individualRiskScore, "risk");
            const riskLevel = get(individualRiskScore, "riskLevel");
            const numberOfChanges = get(individualRiskScore, "numberOfChanges");
            const isSan = get(individualRiskScore, "isSanction");
            return (
              <RiskRatingLabel
                level={riskLevel}
                value={risk}
                size="small"
                type={isSan ? "San" : ""}
                numberOfChanges={numberOfChanges}
              />
            );
          }
        },

        "individualRequest.name": {
          sort: false,
          className: styles.width160,
          style: { wordBreak: "break-all" },
          label: <IntlMessages id="name" />
        },
        "individualRequest.dateOfBirth": {
          sort: false,
          align: "left",
          className: styles.width160,
          label: <IntlMessages id="date-of-birth" />,
          renderCell: (v) => (
            <div className={"flex-start"}>
              <Nullable>{formatDate(v)}</Nullable>
            </div>
          )
        },
        "individualRequest.nationality": {
          sort: false,
          className: styles.width115,
          label: <IntlMessages id="nationality" />,
          align: "center",
          renderCell: (v) => (
            <Nullable
              component={CountryFlagLanguage}
              demonym
              valueProp={"countryCode"}
              svg
            >
              {v}
            </Nullable>
          )
        },
        "positiveMatch.keywords": {
          label: <IntlMessages id="keywords" />,
          align: "center",
          className: styles.width140,
          sort: false,
          renderCell: (v) => {
            return <Keyword keywords={v} />;
          }
        },
        updatedAt: {
          label: <IntlMessages id="last-modified-by" />,
          sort: false,
          className: styles.width160,
          renderCell: (v, { lastModifiedBy }) => (
            <div className={"d-flex align-items-center"}>
              <Nullable
                component={UserAvatar}
                valueProp={"user"}
                description={formatDate(v, LONG_DATE_TIME)}
              >
                {lastModifiedBy}
              </Nullable>
            </div>
          )
        },
        add: {
          sort: false,
          label: "",
          className: styles.width30,
          renderCell: (v, rowData) => (
            <div className={"d-flex align-items-center"}>
              <Button
                size={"small"}
                variant={"contained"}
                disabled={v}
                color={"primary"}
                fullWidth
                onClick={() => onPressAdd(rowData)}
              >
                <IntlMessages id="kyb.table.add" />
              </Button>
            </div>
          )
        }
      }}
      data={data}
    />
  );
};

export default ExistingTable;
