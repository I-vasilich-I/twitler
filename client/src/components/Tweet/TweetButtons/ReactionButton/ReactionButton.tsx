import { Button } from "antd";
import useReactionButtonProps from "../../../../hooks/useReactionButtonProps";
import { ReactionButtonTypes } from "../../../../types";

type Props = {
  type: ReactionButtonTypes;
  hasMyReaction: boolean;
  tweetId: number;
};

const ReactionButton = ({ type, hasMyReaction, tweetId }: Props) => {
  const buttonProps = useReactionButtonProps(type, hasMyReaction, tweetId);

  if (!buttonProps) {
    return null;
  }

  const { color, title, handleClick, icon } = buttonProps;

  return (
    <Button type="text" icon={icon} onClick={handleClick} style={{ color }}>
      {title}
    </Button>
  );
};

export default ReactionButton;
