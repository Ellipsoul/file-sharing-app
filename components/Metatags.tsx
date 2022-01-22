import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
}

// For SEO purposes
export default function Metatags({
  title = "TurboFile",
  description = "File sharing in seconds",
}: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
}
