import { redirect } from "next/navigation";

export default function Home() {
  redirect('/admin/dashboard');

  // This won't be rendered due to redirect
  return null;
}
