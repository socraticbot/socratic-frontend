import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import App from '@/components/App';

export default function Home() {
  const [didMount, setDidMount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (!didMount || !router.isReady) {
    return null;
  }

  return <App initialMessage={typeof router.query.q === 'string' ? router.query.q : undefined} />;
}
