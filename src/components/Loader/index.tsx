import styles from './loader.module.scss';

interface ILoader {
  isWhite?: boolean;
  small?: boolean;
}

const Loader = ({ isWhite = false, small = false }: ILoader) => (
  <div
    className={`${styles.loader}${isWhite ? ` ${styles.white}` : ''}${small ? ` ${styles.small}` : ''}`}
  >
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default Loader;
