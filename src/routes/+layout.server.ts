import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Check if this is an LTI launch by looking for LTI session cookie
  const ltiSessionCookie = cookies.get('lti-session');
  const isLTILaunch = url.searchParams.has('lti') || !!ltiSessionCookie;
  
  let ltiContext = null;
  
  if (ltiSessionCookie) {
    try {
      ltiContext = JSON.parse(ltiSessionCookie);
    } catch (error) {
      console.error('Failed to parse LTI session:', error);
    }
  }

  return {
    ltiContext,
    isLTILaunch
  };
};