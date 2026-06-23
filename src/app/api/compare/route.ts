import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsString = searchParams.get('ids') || '';

    if (!idsString.trim()) {
      return NextResponse.json({ error: 'No college IDs provided for comparison.' }, { status: 400 });
    }

    const ids = idsString.split(',').map(id => id.trim()).filter(id => id !== '');

    // Cap checking: max 3 colleges for comparison
    if (ids.length > 3) {
      return NextResponse.json({ error: 'You can compare a maximum of 3 colleges simultaneously.' }, { status: 400 });
    }

    if (ids.length === 0) {
      return NextResponse.json({ error: 'Please select at least 1 college to compare.' }, { status: 400 });
    }

    // Fetch colleges
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        courses: true,
        placements: true,
        reviews: {
          select: { rating: true }
        }
      }
    });

    // Enforce matching order as requested in ids parameter
    const sortedColleges = ids.map(id => colleges.find((c: any) => c.id === id)).filter(Boolean);

    // Map to compute average reviews rating dynamically
    const mappedColleges = sortedColleges.map((col: any) => {
      if (!col) return null;
      const ratings = col.reviews.map((r: { rating: number }) => r.rating);
      const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length) * 10) / 10
        : 0;

      const { reviews, ...collegeData } = col;
      return {
        ...collegeData,
        rating: averageRating,
      };
    });

    return NextResponse.json({ colleges: mappedColleges }, { status: 200 });

  } catch (error) {
    console.error('Comparison API error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
