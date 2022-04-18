//@flow
import { Avatar, Tooltip } from "@material-ui/core";
import { AvatarProps } from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { toRem } from "@protego/sdk/utils/measurements";
import { extractLetters } from "@protego/sdk/utils/string";
import React, { Fragment } from "react";
import { compose, withProps } from "recompose";
import { UserDtoRes } from "types/typings-api";
import { getFullName } from "util/string";
interface UserAvatarProps<Dto = UserDtoRes> extends AvatarProps {
  description?: string;
  noExtractLetter?: boolean;
  notAvailable?: boolean;
  size?: number;
  toolTipTitle?: string | React.ReactNode;
  user: Dto;
}

const withNotAvailableStr = (letters: string, notAvailable: boolean): string =>
  notAvailable ? letters.slice(0, 1) + "/" + letters.slice(1) : letters;

const UserAvatar: React.ElementType<
  UserAvatarProps<UserDtoRes | string>
> = compose(
  withProps((props: UserAvatarProps<UserDtoRes | string>) => {
    if (!props.user)
      return {
        user: {
          firstName: "Not",
          lastName: "Available",
          colorCode: ThemeColors.darkGray,
        },
        notAvailable: true,
      };
    if (typeof props.user === "string") {
      const [firstName, ...lastName] = props.user.split(" ");
      return {
        user: {
          firstName,
          lastName: lastName.join(" "),
          colorCode: "#7D7D7D",
        },
      };
    }
  }),
  withStyles<"root", {}, UserAvatarProps>(
    (theme) => {
      const size = (props) => theme.typography.pxToRem(props.size || 34);
      return {
        root: {
          backgroundColor: (props) => props.user.colorCode || "#7D7D7D",
          color: "#fff",
          fontSize: (props) => toRem(props.notAvailable ? 8 : 10),
          width: size,
          height: size,
        },
      };
    },
    { name: "MuiUserAvatar" }
  )
)(function UserAvatar(props: UserAvatarProps) {
  const {
    classes,
    user,
    notAvailable,
    className,
    noExtractLetter = false,
    toolTipTitle,
    description,
    src,
    ...others
  } = props;
  const fullName = getFullName(user);

  return (
    <Fragment>
      <Tooltip arrow title={toolTipTitle || fullName}>
        {
          //ts-ignore
        }
        <Avatar classes={classes} className={className} {...others} src={src}>
          {withNotAvailableStr(
            noExtractLetter ? fullName : extractLetters(fullName),
            notAvailable
          )}
        </Avatar>
      </Tooltip>

      {description && <div>{description}</div>}
    </Fragment>
  );
});

export default UserAvatar;
