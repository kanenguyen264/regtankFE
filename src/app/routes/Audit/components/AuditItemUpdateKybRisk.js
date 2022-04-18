import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import React from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { designationCodeToName } from "util/designationList";
import { paymentModeCodeToName } from "util/paymentModeList";
import { getFullName } from "util/string";
import styles from "../AuditPage.module.scss";

const AuditItemUpdateKybRisk = ({ item }) => {
  const {
    otherRiskFactors,
    directors,
    individuals,
    business,
    refId,
  } = item.payload;

  return (
    <>
      {otherRiskFactors && (
        <div>
          <div className={styles.itemPadding}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>{" "}
            <span>
              <IntlMessages id="audit.update.kybRiskItem.editedTheOtherRiskFactors" />
            </span>
            {otherRiskFactors.sourceOfFunds && (
              <span>
                {otherRiskFactors.sourceOfFunds ? ", " : " "}
                <IntlMessages id="audit.update.kybRiskItem.theSourceOfFunds" />{" "}
                {otherRiskFactors.sourceOfFunds.from ? (
                  <>
                    <IntlMessages id="audit.from" />{" "}
                    <span>{`${otherRiskFactors.sourceOfFunds.from} `}</span>
                  </>
                ) : (
                  ""
                )}
                <IntlMessages id="audit.to" />{" "}
                {otherRiskFactors.sourceOfFunds.to ? (
                  otherRiskFactors.sourceOfFunds.to
                ) : (
                  <span style={{ fontStyle: "italic" }}>null</span>
                )}
              </span>
            )}
            {otherRiskFactors.countryOfFunds && (
              <span>
                {otherRiskFactors.sourceOfFunds ? ", " : " "}
                <IntlMessages id="audit.update.kybRiskItem.theCountryOfFunds" />{" "}
                {otherRiskFactors.countryOfFunds.from ? (
                  <>
                    <IntlMessages id="audit.from" />
                    <span>{` ${otherRiskFactors.countryOfFunds.from} `}</span>
                  </>
                ) : (
                  ""
                )}
                <IntlMessages id="audit.to" />{" "}
                {otherRiskFactors.countryOfFunds.to ? (
                  otherRiskFactors.countryOfFunds.to
                ) : (
                  <span style={{ fontStyle: "italic" }}>null</span>
                )}
              </span>
            )}
            {otherRiskFactors.paymentMode && (
              <span>
                {otherRiskFactors.sourceOfFunds ||
                otherRiskFactors.countryOfFunds ? (
                  <IntlMessages id="audit.update.kybRiskItem.and" />
                ) : (
                  " "
                )}
                <IntlMessages id="audit.update.kybRiskItem.thePayment" />
                {otherRiskFactors.paymentMode.from ? (
                  <>
                    <span>
                      <IntlMessages id="audit.from" />{" "}
                    </span>
                    <IntlMessages
                      id={
                        paymentModeCodeToName(otherRiskFactors.paymentMode.from)
                          .label
                      }
                    ></IntlMessages>
                  </>
                ) : (
                  ""
                )}{" "}
                <IntlMessages id="audit.to" />{" "}
                <IntlMessages
                  id={
                    paymentModeCodeToName(otherRiskFactors.paymentMode.to).label
                  }
                ></IntlMessages>
              </span>
            )}
            {otherRiskFactors.others ? ", " : " "}
            {otherRiskFactors.others && (
              <span>
                <IntlMessages id="others" /> <IntlMessages id="audit.edited" />{" "}
              </span>
            )}
            <IntlMessages id="audit.for" />{" "}
            <Link to={`/app/screen-kyb/result/${refId}/riskAssessment`}>
              {refId}
            </Link>
            <div className={styles.textActivityDateTime}>
              {formatDate(item.createdAt, LONG_DATE_TIME)}
            </div>
          </div>
        </div>
      )}

      {directors && (
        <div>
          <div className={styles.itemPadding}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>{" "}
            {directors.add && directors.add.length > 0 && (
              <>
                <span>
                  <IntlMessages id="audit.added" />
                  {" ("}
                </span>
                {directors.add.map((itemA, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyc/result/${itemA.refId}`}>
                        {itemA.refId}
                      </Link>
                      {itemA.designation && (
                        <>
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.designation" />{" "}
                          </span>

                          <IntlMessages
                            id={
                              designationCodeToName(itemA.designation.to).label
                            }
                          ></IntlMessages>
                        </>
                      )}
                      {itemA.remarks && (
                        <>
                          {itemA.designation && (
                            <span>
                              {" "}
                              <IntlMessages id="audit.update.kybRiskItem.and" />
                            </span>
                          )}
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.Remarks" />{" "}
                            <IntlMessages id="audit.edited" />
                          </span>
                        </>
                      )}
                      {index !== directors.add.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            {directors.update && directors.update.length > 0 && (
              <>
                {directors.add && directors.add.length > 0 && ", "}
                <span>
                  <IntlMessages id="audit.edited" />
                  {" ("}
                </span>
                {directors.update.map((itemU, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyc/result/${itemU.refId}`}>
                        {itemU.refId}
                      </Link>
                      {itemU.designation && (
                        <>
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.designation" />{" "}
                          </span>
                          {itemU.designation.from && (
                            <span>
                              <IntlMessages id="audit.from" />{" "}
                              <IntlMessages
                                id={
                                  designationCodeToName(itemU.designation.from)
                                    .label
                                }
                              ></IntlMessages>
                            </span>
                          )}
                          {itemU.designation.to && (
                            <span>
                              {" "}
                              <IntlMessages id="audit.to" />{" "}
                              <IntlMessages
                                id={
                                  designationCodeToName(itemU.designation.to)
                                    .label
                                }
                              ></IntlMessages>
                            </span>
                          )}
                        </>
                      )}
                      {itemU.remarks && (
                        <>
                          {itemU.designation && (
                            <span>
                              {" "}
                              <IntlMessages id="audit.update.kybRiskItem.and" />
                            </span>
                          )}
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.Remarks" />{" "}
                            <IntlMessages id="audit.edited" />
                          </span>
                        </>
                      )}
                      {index !== directors.update.length - 1 && ", "}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            {directors.delete && directors.delete.length > 0 && (
              <>
                {(directors.add.length > 0 || directors.update.length > 0) && (
                  <IntlMessages id="audit.update.kybRiskItem.and" />
                )}
                <span>
                  {" "}
                  <IntlMessages id="audit.deleted" />
                  {" ("}
                </span>
                {directors.delete.map((itemD, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyc/result/${itemD.refId}`}>
                        {itemD.refId}
                      </Link>
                      {index !== directors.delete.length - 1 && ", "}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            <span>
              <IntlMessages id="audit.update.kybRiskItem.fromTheListOfDirectorsOf" />
            </span>
            <Link to={`/app/screen-kyb/result/${refId}/riskAssessment`}>
              {refId}
            </Link>
          </div>
        </div>
      )}

      {individuals && (
        <div>
          <div className={styles.itemPadding}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>
            {/* individuals add */}
            {individuals.add && individuals.add.length > 0 && (
              <>
                <span>
                  {" "}
                  <IntlMessages id="audit.added" />
                  {" ("}
                </span>
                {individuals.add.map((itemA, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyc/result/${itemA.refId}`}>
                        {itemA.refId}
                      </Link>
                      {itemA.percentOfShare && (
                        <>
                          <span>{` ${itemA.percentOfShare.to}`}%</span>
                        </>
                      )}
                      {itemA.remarks && (
                        <>
                          {itemA.percentOfShare && (
                            <span>
                              {" "}
                              <IntlMessages id="audit.update.kybRiskItem.and" />
                            </span>
                          )}
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.Remarks" />{" "}
                            <IntlMessages id="audit.edited" />
                          </span>
                        </>
                      )}
                      {index !== individuals.add.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            {/* individuals update */}
            {individuals.update && individuals.update.length > 0 && (
              <>
                {individuals.add && individuals.add.length > 0 && ","}
                <span>
                  {" "}
                  <IntlMessages id="audit.edited" />
                  {" ("}
                </span>
                {individuals.update.map((itemU, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyc/result/${itemU.refId}`}>
                        {itemU.refId}
                      </Link>
                      {itemU.percentOfShare && (
                        <>
                          {itemU.percentOfShare.from && (
                            <span>
                              <IntlMessages id="audit.from" />
                              {` ${itemU.percentOfShare.from}%`}
                            </span>
                          )}
                          {itemU.percentOfShare.to ? (
                            <span>
                              {" "}
                              <IntlMessages id="audit.to" />
                              {` ${itemU.percentOfShare.to}%`}
                            </span>
                          ) : (
                            <>
                              <span>
                                {" "}
                                <IntlMessages id="audit.to" />{" "}
                              </span>
                              <span style={{ fontStyle: "italic" }}>null</span>
                            </>
                          )}
                        </>
                      )}
                      {itemU.remarks && (
                        <>
                          {itemU.percentOfShare && (
                            <span>
                              {" "}
                              <IntlMessages id="audit.update.kybRiskItem.and" />
                            </span>
                          )}
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.Remarks" />{" "}
                            <IntlMessages id="audit.edited" />
                          </span>
                        </>
                      )}

                      {index !== individuals.update.length - 1 && ", "}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            {/* individuals delete */}
            {individuals.delete && individuals.delete.length > 0 && (
              <>
                {(individuals.add.length > 0 ||
                  individuals.update.length > 0) && (
                  <IntlMessages id="audit.update.kybRiskItem.and" />
                )}
                <span>
                  {" "}
                  <IntlMessages id="audit.deleted" />
                  {" ("}
                </span>
                {individuals.delete.map((itemD, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyc/result/${itemD.refId}`}>
                        {itemD.refId}
                      </Link>
                      {index !== individuals.delete.length - 1 && ", "}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            <span>
              <IntlMessages id="audit.update.kybRiskItem.fromTheListOfIndividualsOf" />
            </span>
            <Link to={`/app/screen-kyb/result/${refId}/riskAssessment`}>
              {refId}
            </Link>
            <div className={styles.textActivityDateTime}>
              {formatDate(item.createdAt, LONG_DATE_TIME)}
            </div>
          </div>
        </div>
      )}

      {business && (
        <div>
          <div className={styles.itemPadding}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>{" "}
            {/* individuals add */}
            {business.add && business.add.length > 0 && (
              <>
                <span>
                  {" "}
                  <IntlMessages id="audit.added" />
                  {" ("}
                </span>
                {business.add.map((itemA, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyb/result/${itemA.refId}`}>
                        {itemA.refId}
                      </Link>
                      {itemA.percentOfShare && (
                        <>
                          {itemA.percentOfShare.to && (
                            <>
                              <span>{` ${itemA.percentOfShare.to}`}%</span>
                            </>
                          )}
                        </>
                      )}
                      {itemA.remarks && (
                        <>
                          {itemA.percentOfShare && (
                            <span>
                              {" "}
                              <IntlMessages id="audit.update.kybRiskItem.and" />
                            </span>
                          )}
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.Remarks" />{" "}
                            <IntlMessages id="audit.edited" />
                          </span>
                        </>
                      )}

                      {index !== business.add.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            {/* individuals update */}
            {business.update && business.update.length > 0 && (
              <>
                {business.add && business.add.length > 0 && ","}
                <span>
                  {" "}
                  <IntlMessages id="audit.edited" />
                  {" ("}
                </span>
                {business.update.map((itemU, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyb/result/${itemU.refId}`}>
                        {itemU.refId}
                      </Link>
                      {itemU.percentOfShare && (
                        <>
                          {itemU.percentOfShare.from && (
                            <span>
                              <IntlMessages id="audit.from" />
                              {` ${itemU.percentOfShare.from}%`}
                            </span>
                          )}
                          {itemU.percentOfShare.to ? (
                            <span>
                              {" "}
                              <IntlMessages id="audit.to" />
                              {` ${itemU.percentOfShare.to}%`}
                            </span>
                          ) : (
                            <>
                              <span>
                                {" "}
                                <IntlMessages id="audit.to" />{" "}
                              </span>
                              <span style={{ fontStyle: "italic" }}>null</span>
                            </>
                          )}
                        </>
                      )}
                      {itemU.remarks && (
                        <>
                          {itemU.percentOfShare && (
                            <span>
                              {" "}
                              <IntlMessages id="audit.update.kybRiskItem.and" />
                            </span>
                          )}
                          <span>
                            {" "}
                            <IntlMessages id="kyb.table.Remarks" />{" "}
                            <IntlMessages id="audit.edited" />
                          </span>
                        </>
                      )}

                      {index !== business.update.length - 1 && ", "}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            {/* individuals delete */}
            {business.delete && business.delete.length > 0 && (
              <>
                {(business.add.length > 0 || business.update.length > 0) && (
                  <IntlMessages id="audit.update.kybRiskItem.and" />
                )}
                <span>
                  {" "}
                  <IntlMessages id="audit.deleted" />
                  {" ("}
                </span>
                {business.delete.map((itemD, index) => {
                  return (
                    <span key={index}>
                      <Link to={`/app/screen-kyb/result/${itemD.refId}`}>
                        {itemD.refId}
                      </Link>
                      {index !== business.delete.length - 1 && ", "}
                    </span>
                  );
                })}
                <span>{")"}</span>
              </>
            )}
            <span>
              <IntlMessages id="audit.update.kybRiskItem.fromTheListOfBusinessesOf" />
            </span>
            <Link to={`/app/screen-kyb/result/${refId}/riskAssessment`}>
              {refId}
            </Link>
            <div className={styles.textActivityDateTime}>
              {formatDate(item.createdAt, LONG_DATE_TIME)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(AuditItemUpdateKybRisk);
