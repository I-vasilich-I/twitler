import { Empty, Layout, message, Spin } from "antd";
import { useEffect } from "react";
import { ERROR_MESSAGES } from "../../constants";
import UserCard from "../../elements/UserCard/UserCard";
import { getImageUrl } from "../../helpers";
import { useGetPeopleQuery } from "../../redux/store/api/apiSlice";

type Props = {
  url: string;
};

const People = ({ url }: Props) => {
  const { data, isLoading, isError } = useGetPeopleQuery(url);

  useEffect(() => {
    if (isError) {
      message.error(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }, [isError]);

  return (
    <Layout
      style={{
        maxWidth: "825px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {data?.length ? (
        data.map(({ id, avatar, username, bio, followers, amIFollowing }) => (
          <UserCard
            key={id}
            userId={id}
            avatar={getImageUrl(avatar)}
            username={username}
            bio={bio}
            followers={followers}
            amIFollowing={amIFollowing}
          />
        ))
      ) : (
        <Spin spinning={isLoading} size="large">
          <Empty />
        </Spin>
      )}
    </Layout>
  );
};

export default People;
