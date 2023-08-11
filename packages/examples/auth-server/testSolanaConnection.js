const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const fetch = require("node-fetch");

const main = async () => {
  const authTokenResponse = await fetch(
    process.env.TOKEN_ENDPOINT || "http://localhost:3020/get_token"
  );
  const responseObj = await authTokenResponse.json();
  console.log("authTokenResponse", { authTokenResponse, responseObj });
  const authToken = responseObj.access_token;
  const fetchFn = (input, options) => {
    const inHeaders = options?.headers || new Headers();
    const headers = { ...inHeaders, Authorization: `Bearer ${authToken}` };
    return fetch(
      input,
      options
        ? {
            ...options,
            headers,
          }
        : { headers }
    );
  };
  const httpHeaders = { Authorization: `Bearer ${authToken}` };
  console.log("auth token", JSON.stringify(httpHeaders));
  const solanaConnection = new Connection(
    process.env.SOLANA_MAINNET_RPC || clusterApiUrl("mainnet-beta"),
    {
      fetch: fetchFn,
    }
  );
  const balance = await solanaConnection.getBalance(
    new PublicKey("GLZWTWxih6T4uM1oJunWMRUydPbhuRkLN1hpZN5TQ9DW")
  );
  console.log("balance", balance);
};

main().catch(console.error);
