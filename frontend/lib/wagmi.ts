import { createConfig, http } from "wagmi";
import { avalancheFuji, avalanche } from "wagmi/chains";

export const config = createConfig({
  chains: [avalancheFuji, avalanche],
  transports: {
    [avalancheFuji.id]: http(process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc"),
    [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
  },
});
