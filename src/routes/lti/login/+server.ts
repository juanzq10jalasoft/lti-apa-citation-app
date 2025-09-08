import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import LTIProvider from '$lib/lti/provider.js';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const ltiProvider = LTIProvider.getInstance();
    const provider = await ltiProvider.setup();

    // Extract form data from the request
    const formData = await request.formData();
    const loginHint = formData.get('login_hint') as string;
    const targetLinkUri = formData.get('target_link_uri') as string;
    const ltiMessageHint = formData.get('lti_message_hint') as string;
    const clientId = formData.get('client_id') as string;
    const issuer = formData.get('iss') as string;

    // Validate required LTI OIDC login parameters
    if (!loginHint || !targetLinkUri || !clientId || !issuer) {
      return json({ error: 'Missing required LTI parameters' }, { status: 400 });
    }

    // Generate OIDC login URL
    const loginUrl = await provider.oidcLogin({
      iss: issuer,
      login_hint: loginHint,
      target_link_uri: targetLinkUri,
      lti_message_hint: ltiMessageHint,
      client_id: clientId
    });

    // Redirect to platform for authentication
    throw redirect(302, loginUrl);
  } catch (error) {
    console.error('LTI Login error:', error);
    return json({ error: 'LTI login failed' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  // Handle GET requests for OIDC login initiation
  const loginHint = url.searchParams.get('login_hint');
  const targetLinkUri = url.searchParams.get('target_link_uri');
  const ltiMessageHint = url.searchParams.get('lti_message_hint');
  const clientId = url.searchParams.get('client_id');
  const issuer = url.searchParams.get('iss');

  if (!loginHint || !targetLinkUri || !clientId || !issuer) {
    return json({ error: 'Missing required LTI parameters' }, { status: 400 });
  }

  try {
    const ltiProvider = LTIProvider.getInstance();
    const provider = await ltiProvider.setup();

    const loginUrl = await provider.oidcLogin({
      iss: issuer,
      login_hint: loginHint,
      target_link_uri: targetLinkUri,
      lti_message_hint: ltiMessageHint,
      client_id: clientId
    });

    throw redirect(302, loginUrl);
  } catch (error) {
    console.error('LTI Login error:', error);
    return json({ error: 'LTI login failed' }, { status: 500 });
  }
};