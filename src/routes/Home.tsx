import { Grid } from "@intility/bifrost-react";
import Docs from "~/components/Docs";
import Setup from "~/components/Setup";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <Grid className={styles.home} gap={32}>
      <h2 className="bf-h2">__APP_NAME__</h2>
      <p className="bf-p">
        This app was created from{" "}
        <a
          className="bf-link"
          href="https://github.com/intility/react-vibe-template"
          target="_blank"
          rel="noreferrer"
        >
          react-vibe-template
        </a>{" "}
        and runs on the Intility vibe platform.
      </p>
      <Setup />
      <h2 className="bf-h2">Read the docs</h2>
      <Docs />
    </Grid>
  );
}
