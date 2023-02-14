import { HeartOutlined, RetweetOutlined, TagOutlined } from "@ant-design/icons";
import { message } from "antd";
import { ReactNode, useEffect } from "react";
import { ERROR_MESSAGES } from "../constants";
import { useReactOnTweetMutation } from "../redux/store/api/apiSlice";
import { ReactionButtonTypes } from "../types";

type ButtonProps = {
  color: string;
  title: string;
  handleClick: () => void;
  icon: ReactNode;
};

const useReactionButtonProps = (type: ReactionButtonTypes, hasMyReaction: boolean, tweetId: number) => {
  const [reactOnTweet, { isError }] = useReactOnTweetMutation();
  const buttonProps: Partial<ButtonProps> = {};

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  switch (type) {
    case ReactionButtonTypes.LIKE:
      buttonProps.color = hasMyReaction ? "#EB5757" : "#4F4F4F";
      buttonProps.title = hasMyReaction ? "Liked" : "Like";
      buttonProps.handleClick = () => reactOnTweet({ like: !hasMyReaction, tweetId });
      buttonProps.icon = <HeartOutlined />;
      break;
    case ReactionButtonTypes.RETWEET:
      buttonProps.color = hasMyReaction ? "#27AE60" : "#4F4F4F";
      buttonProps.title = hasMyReaction ? "Retweeted" : "Retweet";
      buttonProps.handleClick = () => reactOnTweet({ retweet: !hasMyReaction, tweetId });
      buttonProps.icon = <RetweetOutlined />;
      break;
    case ReactionButtonTypes.SAVE:
      buttonProps.color = hasMyReaction ? "#2D9CDB" : "#4F4F4F";
      buttonProps.title = hasMyReaction ? "Saved" : "Save";
      buttonProps.handleClick = () => reactOnTweet({ save: !hasMyReaction, tweetId });
      buttonProps.icon = <TagOutlined />;
      break;
    default:
      return null;
  }

  return buttonProps as ButtonProps;
};

export default useReactionButtonProps;
