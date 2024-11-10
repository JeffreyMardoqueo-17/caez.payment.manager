import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    // Si el usuario intenta acceder a una ruta protegida sin un token, redirigir a "/"
    if (!token && request.nextUrl.pathname.startsWith('/home')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Configuración para que el middleware solo aplique en las rutas que necesitan protección
export const config = {
    matcher: ['/home/:path*', '/padrinos/:path*'],
};
