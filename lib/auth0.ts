// Auth0 configuration — placeholder
// Configure Auth0 SDK with Token Vault for AI agent access

// TODO: Initialize Auth0 with initAuth0() from @auth0/nextjs-auth0
// import { initAuth0 } from "@auth0/nextjs-auth0";

// export const auth0 = initAuth0({
//   secret: process.env.AUTH0_SECRET,
//   baseURL: process.env.AUTH0_BASE_URL,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//   clientID: process.env.AUTH0_CLIENT_ID,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET,
// });

export const auth0Config = {
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL ?? "http://localhost:3000",
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
};
