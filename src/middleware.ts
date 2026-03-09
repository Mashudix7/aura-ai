import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
    const isProtectedRoute = ['/profile', '/checkout'].some(p => req.nextUrl.pathname.startsWith(p))
    const isAuthRoute = ['/login', '/register'].includes(req.nextUrl.pathname)

    if (isApiAuthRoute) return

    // Redirect logged-in users away from auth pages
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL('/chat', req.nextUrl))
        }
        return
    }

    // Only protect profile and checkout pages
    if (!isLoggedIn && isProtectedRoute) {
        return Response.redirect(new URL(`/?auth=signin&callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`, req.nextUrl))
    }

    return
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
