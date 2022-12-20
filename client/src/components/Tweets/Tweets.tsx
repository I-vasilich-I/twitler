import { message, Spin } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ERROR_MESSAGES } from "../../constants";
import useTweetsUrl from "../../hooks/useTweetsUrl";
import { useGetTweetsQuery } from "../../redux/store/api/apiSlice";
import TweetsContainer from "../TweetsContainer/TweetsContainer";
import "./Tweets.scss";

const Tweets = () => {
  const { userId } = useParams();
  const url = useTweetsUrl(userId ? Number(userId) : undefined);
  const { data, isLoading, isError } = useGetTweetsQuery(url);

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
