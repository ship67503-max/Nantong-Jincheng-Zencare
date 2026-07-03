export default function handler(req, res) {
  const clientId = process.env.APPLE_CLIENT_ID;
  const redirectUri = process.env.APPLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    res.writeHead(302, {
      Location: '/sign-in?provider=apple&status=setup-required',
    });
    res.end();
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code id_token',
    response_mode: 'form_post',
    scope: 'name email',
    state: 'jczcare-business-account',
  });

  res.writeHead(302, {
    Location: `https://appleid.apple.com/auth/authorize?${params.toString()}`,
  });
  res.end();
}
