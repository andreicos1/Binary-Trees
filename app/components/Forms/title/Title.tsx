import { Heading } from "@chakra-ui/react";
import styles from "./Title.module.scss";

interface Props {
  title: string;
}
const Title = ({ title }: Props) => {
  return <Heading className={styles.title}>{title}</Heading>;
};

export default Title;
