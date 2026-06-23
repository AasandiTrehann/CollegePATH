import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const feesMax = searchParams.get('feesMax');
    const ratingMin = searchParams.get('ratingMin');
    const course = searchParams.get('course') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    const skip = (page - 1) * limit;

    // 1. ratingMin filtering via Review aggregation (groupBy + having)
    let matchingCollegeIds: string[] | undefined;
    if (ratingMin) {
      const minRatingVal = parseFloat(ratingMin);
      if (!isNaN(minRatingVal)) {
        const reviewAggregations = await prisma.review.groupBy({
          by: ['collegeId'],
          _avg: { rating: true },
          having: {
            rating: {
              _avg: { gte: minRatingVal }
            }
          }
        });
        matchingCollegeIds = reviewAggregations.map((agg: { collegeId: string }) => agg.collegeId);
      }
    }

    // 2. Build Where Filter
    const where: any = {};

    // Apply rating filter matching IDs if defined
    if (matchingCollegeIds !== undefined) {
      where.id = { in: matchingCollegeIds };
    }

    // Search query matches name or location
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Location filter
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Maximum fees filter (Annual college fees)
    if (feesMax) {
      const feesMaxVal = parseFloat(feesMax);
      if (!isNaN(feesMaxVal)) {
        where.fees = { lte: feesMaxVal };
      }
    }

    // Course nested relation filter
    if (course) {
      where.courses = {
        some: {
          name: { contains: course, mode: 'insensitive' }
        }
      };
    }

    // 3. Query total count for pagination metadata
    const totalCount = await prisma.college.count({ where });

    // 4. Query colleges list
    const colleges = await prisma.college.findMany({
      where,
      skip,
      take: limit,
      include: {
        courses: true,
        placements: true,
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // 5. Map colleges to calculate dynamic ratings from reviews
    const mappedColleges = colleges.map((col: any) => {
      const ratings = col.reviews.map((r: { rating: number }) => r.rating);
      const averageRating = ratings.length > 0 
        ? Math.round((ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length) * 10) / 10
        : 0;

      // Clean reviews array from listing payload for speed
      const { reviews, ...collegeData } = col;
      return {
        ...collegeData,
        rating: averageRating,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      colleges: mappedColleges,
      totalCount,
      totalPages,
      currentPage: page,
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch Colleges API error:', error);
    return NextResponse.json({ error: 'An internal server error occurred fetching colleges.' }, { status: 500 });
  }
}
