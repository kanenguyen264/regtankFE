import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import React from "react";
import { isEmpty } from "lodash";
import ProfileTable, {
  KYCRow,
  KYBRow,
  KYTRow,
} from "../components/ProfileTable/index";
// import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { useSelector } from "react-redux";

const Profile = ({ profiles, caseDetail }) => {
  return (
      <>
        {!isEmpty(profiles) &&
          !isEmpty(caseDetail) &&
          profiles.map((profile, key) => {
            if (profile?.profileType === "KYB") {
              return (
                <ProfileTable
                  key={key}
                  profile={profile}
                  caseDetail={caseDetail}
                  header={[
                    { title: "Business Name", align: "left" },
                    { title: "KYB ID", align: "left" },
                    { title: "Risk Level", align: "center" },
                    { title: "Keywords", align: "center" },
                    { title: "Status", align: "left", className: "statusLv1" },
                    { title: "Remarks", align: "left" },
                  ]}
                  style={{ marginRight: toRem(30), marginBottom: toRem(20) }}
                  body={<KYBRow caseDetail={caseDetail} profile={profile} profileInfo={profile?.profileInfo} />}
                />
              );
            } else if (profile?.profileType === "KYC") {
              return (
                <ProfileTable
                  profile={profile}
                  caseDetail={caseDetail}
                  key={key}
                  header={[
                    { title: "Name", align: "left" },
                    { title: "KYC ID", align: "left" },
                    { title: "Risk Score", align: "center" },
                    { title: "Keywords", align: "center" },
                    { title: "Status", align: "left", className: "statusLv1" },
                    { title: "Remarks", align: "left" },
                  ]}
                  style={{ marginRight: toRem(30), marginBottom: toRem(20) }}
                  body={<KYCRow caseDetail={caseDetail} profile={profile} profileInfo={profile?.profileInfo} />}
                />
              );
            } else {
              return (
                <ProfileTable
                  profile={profile}
                  caseDetail={caseDetail}
                  key={key}
                  header={[
                    { title: "Asset", align: "left" },
                    { title: "KYT ID", align: "left" },
                    { title: "Risk Score", align: "center" },
                    { title: "Wallet Address", align: "center" },
                    { title: "Balance", align: "left" },
                    { title: "Owner", align: "left" },
                    { title: "Remarks", align: "left" },
                  ]}
                  style={{ marginRight: toRem(30), marginBottom: toRem(20) }}
                  body={<KYTRow caseDetail={caseDetail} profile={profile} profileInfo={profile?.profileInfo} />}
                />
              );
            }
          })}
      </>
  );
};

export default Profile;
