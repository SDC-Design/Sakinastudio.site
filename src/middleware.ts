import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Rafraîchit la session Supabase et protège l'administration. */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  let user: any = null;
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    user = (await supabase.auth.getUser()).data.user;
  } catch { /* Supabase injoignable : traité comme non connecté */ }
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !user) {
    const url = request.nextUrl.clone(); url.pathname = "/admin/login"; url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}
export const config = { matcher: ["/admin/:path*", "/espace-client/:path*"] };
