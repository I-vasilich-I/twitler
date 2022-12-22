import { message, Spin } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ERROR_MESSAGES } from "../../constants";
import useTweetsUrl from "../../hooks/useTweetsUrl";
import { useGetTweetsQuery } from "../../redux/store/api/apiSlice";
import TweetsContainer from "../TweetsContainer/TweetsContainer";
import "./Tweets.scss";

type Props = {
  url?: string;
};

const Tweets = ({ url }: Props) => {
  const { userId } = useParams();
  const tweetsUrl = url ?? useTweetsUrl(userId ? Number(userId) : undefined);
  const { data, isLoading, isError } = useGetTweetsQuery(tweetsUrl);

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  return (
    <Spin spinning={isLoading} size="large">
      <TweetsContainer tweets={data ?? []} />;
    </Spin>
  );
};

export default Tweets;
