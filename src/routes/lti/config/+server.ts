import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toolConfig } from '$lib/lti/config.js';

// Serve LTI tool configuration for platform registration
export const GET: RequestHandler = async () => {
  return json(toolConfig);
};