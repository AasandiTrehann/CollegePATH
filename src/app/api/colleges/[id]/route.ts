import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

// 1. GET: Fetch college details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'College ID is required.' }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: {
          orderBy: { name: 'asc' }
        },
        placements: {
          orderBy: { year: 'desc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        },
        cutoffs: {
          orderBy: [
            { exam: 'asc' },
            { category: 'asc' },
            { round: 'asc' },
            { maxRank: 'asc' }
          ]
        }
      }
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found.' }, { status: 404 });
    }

    // Dynamic rating calculation from Reviews
    const ratings = college.reviews.map((r: { rating: number }) => r.rating);
    const averageRating = ratings.length > 0
      ? Math.round((ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length) * 10) / 10
      : 0;

    const enrichedCollege = {
      ...college,
      rating: averageRating,
    };

    return NextResponse.json({ college: enrichedCollege }, { status: 200 });

  } catch (error) {
    console.error('Fetch College Detail API error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

// 2. POST: Post a student review (Protected - requires user login)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const token = request.cookies.get('token')?.value;
    const verified = token ? await verifyJWT(token) : null;

    if (!verified) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to submit a student review.' },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    if (rating === undefined || rating === null) {
      return NextResponse.json({ error: 'Rating is required.' }, { status: 400 });
    }

    const ratingVal = parseFloat(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5.' }, { status: 400 });
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json({ error: 'Comment is required.' }, { status: 400 });
    }

    // Fetch authenticated user's name
    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      select: { name: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Authenticated user profile not found.' }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        studentName: user.name,
        rating: ratingVal,
        comment: comment.trim(),
        collegeId: id
      }
    });

    return NextResponse.json(
      { message: 'Review submitted successfully.', review },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create Review API error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
