import { GreenPlatformApp } from "./GreenPlatformDemo";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const initialSessionExpected = cookieStore.has("gfes_session_consumer") || cookieStore.has("gfes_session");
  return <GreenPlatformApp initialPortal="consumer" initialSessionExpected={initialSessionExpected} />;
}
