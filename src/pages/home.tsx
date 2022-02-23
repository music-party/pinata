import type { InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { withSessionSsr } from "../lib/withSession";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    if (!req.session.access_token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        user: req.session.user,
      },
    };
  }
);

const Home: NextPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <div>Logged in users only!</div>;
};

export default Home;
