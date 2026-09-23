export default {
  async fetch(request, env) {
    const publicUrl = new URL(request.url);
    const backendUrl = new URL(`${publicUrl.pathname}${publicUrl.search}`, "https://gfes.internal");
    const backendRequest = new Request(backendUrl, request);

    if (env.GOOGLE_CLIENT_ID) {
      backendRequest.headers.set("x-gfes-internal-google-client-id", env.GOOGLE_CLIENT_ID);
    }
    const googleClientSecret = env.GOOGLE_CLIENT_SECRET1 ?? env.GOOGLE_CLIENT_SECRET;
    if (googleClientSecret) {
      backendRequest.headers.set("x-gfes-internal-google-client-secret", googleClientSecret);
    }
    if (env.GOOGLE_REDIRECT_URI) {
      backendRequest.headers.set("x-gfes-internal-google-redirect-uri", env.GOOGLE_REDIRECT_URI);
    }

    return env.BACKEND.fetch(backendRequest);
  },
};
