import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyServerAdmin } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    let isAuthorized = false;
    let authErrorDetail = '';

    // 1. Verify Genuine Server-Side Supabase Authenticated Admin Session (getUser + role check)
    const { user: adminUser, error: authError } = await verifyServerAdmin();
    if (adminUser) {
      isAuthorized = true;
    } else {
      authErrorDetail = authError || 'No valid admin session found';
    }

    // 2. Verify External Webhook Secret Token (Bearer header strictly against server secret)
    const configuredSecret = process.env.REVALIDATE_SECRET_TOKEN;
    if (!isAuthorized && configuredSecret) {
      const authHeader = request.headers.get('authorization');
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      if (bearerToken && bearerToken === configuredSecret) {
        isAuthorized = true;
      }
    }

    // Reject unauthorized requests immediately
    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: authErrorDetail || 'Genuine Supabase admin authentication session or valid secret authorization header is required.'
        },
        { status: 401 }
      );
    }

    // Parse payload for target paths / slugs
    const body = await request.json().catch(() => ({}));
    const { path, slug, type } = body;

    const revalidatedPaths: string[] = [];

    if (path) {
      revalidatePath(path);
      revalidatedPaths.push(path);
    }

    if (type === 'article' && slug) {
      const articlePath = `/journal/${slug}`;
      revalidatePath(articlePath);
      revalidatePath('/journal');
      revalidatePath('/');
      revalidatedPaths.push(articlePath, '/journal', '/');
    } else if (type === 'project' && slug) {
      const projectPath = `/work/${slug}`;
      revalidatePath(projectPath);
      revalidatePath('/work');
      revalidatePath('/');
      revalidatedPaths.push(projectPath, '/work', '/');
    } else if (!path) {
      // General site revalidation
      revalidatePath('/');
      revalidatePath('/journal');
      revalidatePath('/work');
      revalidatedPaths.push('/', '/journal', '/work');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths: revalidatedPaths
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Revalidation failed',
        details: err?.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
