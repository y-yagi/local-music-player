import Container from "../components/container";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Player from "../components/player";
import Musics from "../components/musics";
import Uploader from "../components/uploader";
import SectionSeparotr from "../components/section-separator";
import Head from "next/head";

const Index = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>Local Music Player</title>
        </Head>
        <Container>
          <Intro />
          <Player />
          <Musics />
          <SectionSeparotr />
          <Uploader />
        </Container>
      </Layout>
    </>
  );
};

export default Index;
