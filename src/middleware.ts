    import { NextResponse } from 'next/server';
    import type { NextRequest } from 'next/server';

    const protectedRoutes = ['/dashboard', '/settings'];

    export function middleware(request: NextRequest) {
        console.log("request",request)
        // Commented out cookie check since switching to localStorage for auth
        // const isAuthenticated = request.cookies.has('token');

        const { pathname } = request.nextUrl;

        // if (!isAuthenticated && protectedRoutes.includes(pathname)) {
        //     const loginUrl = new URL('/login', request.url);
        //     return NextResponse.redirect(loginUrl);
        // }

        return NextResponse.next();
    }

    export const config = {
        matcher: ['/dashboard/:path*', '/settings/:path*'],
    };