import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';

export default function Layout(props) {
  const location = useLocation();
  return (
    <>
      <Head>
        <meta
          property="google-site-verification"
          content={'VnGnUPzlKD0BatpTv3Ik0ax09Ph7WOggw6Fu_OF_2M0'}
        />
      </Head>
      <OriginalLayout {...props} />
    </>
  );
}
