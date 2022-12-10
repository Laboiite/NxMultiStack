import styles from './react-app-a-shell.module.scss';

/* eslint-disable-next-line */
export interface ReactAppAShellProps {}

export function ReactAppAShell(props: ReactAppAShellProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ReactAppAShell!</h1>
    </div>
  );
}

export default ReactAppAShell;
