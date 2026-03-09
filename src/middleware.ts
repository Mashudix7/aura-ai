import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
    const isPublicRoute = ['/', '/pricing', '/about'].includes(req.nextUrl.pathname)
    const isAuthRoute = ['/login', '/register'].includes(req.nextUrl.pathname)

    if (isApiAuthRoute) return

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL('/chat', req.nextUrl))
        }
        return
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL('/login', req.nextUrl))
    }

    return
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
