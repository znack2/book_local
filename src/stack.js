
import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables
  projectId: "5b9a8411-c283-40f5-a0bc-ed7eba694397",
  publishableClientKey: "pck_rgyrearvfzsd2y90at1f510zh3j6jkvp75nceesrmse68",
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  }
});
