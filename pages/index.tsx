import Container from "../components/container";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Musics from "../components/musics";
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
          <Musics />
        </Container>
      </Layout>
    </>
  );
};

export default Index;
