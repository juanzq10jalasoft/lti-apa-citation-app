import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import LTIProvider from '$lib/lti/provider.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const ltiProvider = LTIProvider.getInstance();
    const provider = await ltiProvider.setup();

    // Extract form data
    const formData = await request.formData();
    const idToken = formData.get('id_token') as string;
    const state = formData.get('state') as string;

    if (!idToken) {
      return json({ error: 'Missing id_token' }, { status: 400 });
    }

    // Validate the LTI launch token
    const token = await provider.validateIdToken(idToken, state);
    
    if (!token) {
      return json({ error: 'Invalid LTI token' }, { status: 401 });
    }

    // Extract launch data using our provider
    const launchData = ltiProvider.extractLaunchData(token);

    // Store launch data in session/cookies for the app to use
    cookies.set('lti-session', JSON.stringify({
      user: launchData.user,
      context: launchData.context,
      platform: launchData.platform,
      isInstructor: launchData.isInstructor,
      isStudent: launchData.isStudent,
      launchTime: new Date().toISOString()
    }), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    // Redirect to the main application with LTI context
    throw redirect(302, '/?lti=true');
    
  } catch (error) {
    console.error('LTI Launch error:', error);
    return json({ 
      error: 'LTI launch failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};