import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import LTIProvider from '$lib/lti/provider.js';

// Serve public JWK keys for LTI platform verification
export const GET: RequestHandler = async () => {
  try {
    const ltiProvider = LTIProvider.getInstance();
    const provider = await ltiProvider.setup();

    // Get the public key set from the LTI provider
    const keySet = await provider.getPublicKey();

    return json({
      keys: [keySet]
    });
  } catch (error) {
    console.error('Error serving JWK keys:', error);
    return json({ error: 'Unable to serve public keys' }, { status: 500 });
  }
};