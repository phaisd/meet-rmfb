import { NextResponse } from "next/server";

export const config = {
  matcher: ['/meets/:path*', '/api/:path*', '/useMeets/:path*']
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  // console.log('Incoming request:', request.method, request.url);

  // exe redirect (กรณ๊ผู้ใช้ไม่ได้ล๊อคอิน)
  // if(!requestAnimationFrame.cookies.get(auth)){
  //   return NextResponse.redirect(new URL('/login',request.url))
  // }

  //Block delete meets ถ้าไม่ได้ส้ง header x-admin=true
  if (pathname.startsWith('/api/meets') && request.method === 'DELETE') {
    const isAdminfb = request.headers.get('x-adminfb') === 'true';
    if (!isAdminfb) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();

}