export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  oauthRedirectUrl:
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL ||
    "http://localhost:8080/oauth2/authorization/google",
};
