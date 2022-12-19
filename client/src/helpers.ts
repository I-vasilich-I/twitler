import moment from "moment";

const formatTimestamp = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  const dateWrapper = moment(date);
  const result = `${dateWrapper.format("MMM D")} at ${dateWrapper.format("h:mm a")}`;
  return result;
};

const getTweetsPath = (path: string, userId?: string | number) => (userId ? `${path}/${userId}` : path);

export { formatTimestamp, getTweetsPath };
