export async function subscribeEmail(email) {
  const url = import.meta.env.VITE_AUTOMATE_SUBSCRIBE_URL;

  if (!url) {
    throw new Error('Automate subscribe URL is not configured');
  }

  const res = await fetch('/automate-subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  console.log('res', res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Subscription failed');
  }

  return true;
}
