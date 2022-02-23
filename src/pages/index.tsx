import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const Index: NextPage = () => {
  return (
    <div className="m-5">
      <Link href="/api/auth/spotify/login">
        <a className="rounded-full py-3 px-5 bg-green-600 hover:bg-green-400">
          Log in with Spotify
        </a>
      </Link>
    </div>
  );
};

export default Index;
