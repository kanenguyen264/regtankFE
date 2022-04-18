import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { IconButton, Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { typeEmail } from "@protego/sdk/utils/regularExpression";
import { fetchAllNotification } from "actions";
import { updateMyProfile } from "actions/me";
import { Form, Formik } from "formik";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { passwordValidation, PASSWORD_REGEX } from "validations/password";
import * as Yup from "yup";
import styles from "./ProfilePage.module.scss";
import ProfilePageCommon from "./ProfilePageCommon";

const ProfilePage = function ProfilePage(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [colorCodeProps, setColorCodeProps] = useState("");
  const callbackFunction = (childData) => {
    setColorCodeProps(childData);
  };
  const formRef = useRef();
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      firstName: Yup.string().required(
        <IntlMessages id="appModule.form.error.firstNameRequired"></IntlMessages>
      ),
      email: Yup.string()

        .required(
          <IntlMessages id="appModule.form.error.emailIsRequired"></IntlMessages>
        )
        .test(
          "Validate Email",
          <IntlMessages id="setting.blacklist.email.valid"></IntlMessages>,
          (value) => {
            return typeEmail(value);
          }
        ),
      phone: Yup.string().matches(/^[+]*[0-9]*$/, {
        message: (
          <IntlMessages id="appModule.form.error.phoneInValid"></IntlMessages>
        ),
        excludeEmptyString: true,
      }),
      password: Yup.string().test("regex", "error", (val) => {
        if (!val) {
          return true;
        }
        const validation = passwordValidation(val, PASSWORD_REGEX);
        return validation.isValid;
      }),
    });
  }, []);

  useEffect(() => {
    dispatch(fetchAllNotification());
  }, [dispatch]);

  const { me } = useSelector((state) => state.me);
  const onPressBack = () => {
    history.push({
      pathname: "/app/dashboard",
    });
  };
  const cancelFrom = () => {
    formRef.current.resetForm();
    onPressBack();
  };

  const onSubmit = (values, actions) => {
    setTimeout(() => {
      try {
        dispatch(updateMyProfile(values));
        onPressBack();
      } catch (e) {
        console.error(e);
      }
    }, 200);
  };

  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"pageProfile.title"} />}
        customUrlResolver={(index) => {
          switch (index) {
            case 1:
              return [null, null, null, true];
            case 2:
              return [null, null, false];
            default:
              break;
          }
        }}
      />
      <div className={styles.header}>
        <div className={"mr-2"}>
          <IconButton
            className={styles.iconBack}
            onClick={() => history.push("/app/dashboard")}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        </div>
        <Typography variant="titleForm">
          <IntlMessages id="dashboard.breadcrumb.title" />
        </Typography>
      </div>
      <div>
        <Formik
          initialValues={{
            firstName: me?.firstName || "",
            lastName: me?.lastName,
            email: me?.email,
            phone: me?.phone,
            bio: me?.bio,
            password: "",
            id: me?.id,
            colorCode: colorCodeProps || me?.colorCode,
          }}
          onSubmit={onSubmit}
          enableReinitialize
          validationSchema={validationSchema}
          innerRef={formRef}
        >
          {({ values, errors }) => {
            return (
              <Form className={"d-flex flex-column"}>
                <JRCard className={styles.jrCardContainer}>
                  <ProfilePageCommon
                    parentCallback={callbackFunction}
                    user={values}
                    cancelFrom={cancelFrom}
                  />
                </JRCard>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Fragment>
  );
};

export default ProfilePage;
