import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { exam, rank: rawRank, category } = await request.json();

    if (!exam) {
      return NextResponse.json({ error: 'Exam type is required.' }, { status: 400 });
    }

    if (rawRank === undefined || rawRank === null) {
      return NextResponse.json({ error: 'Rank is required.' }, { status: 400 });
    }

    const rank = parseInt(rawRank, 10);
    if (isNaN(rank) || rank <= 0) {
      return NextResponse.json({ error: 'Please enter a valid positive rank number.' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Admission category is required.' }, { status: 400 });
    }

    // Composite index: [exam, category, round, maxRank]
    // We query maxRank >= rank * 0.90 to include borderline courses (within 10% of historic cutoffs)
    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam,
        category,
        round: 6, // Round 6 represents the final seat allotment threshold
        maxRank: {
          gte: Math.round(rank * 0.90)
        }
      },
      include: {
        college: {
          include: {
            placements: {
              where: { year: 2023 }
            },
            reviews: {
              select: { rating: true }
            }
          }
        },
        course: true
      },
      orderBy: {
        maxRank: 'asc' // Hardest colleges to get in (lowest cutoff maxRank) sorted first
      }
    });

    // Map cutoffs to PredictionResults with confidence calculations
    const results = cutoffs.map((item: any) => {
      // Dynamic rating calculation for college
      const ratings = item.college.reviews.map((r: { rating: number }) => r.rating);
      const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length) * 10) / 10
        : 0;

      // Extract 2023 average package
      const averagePackage = item.college.placements[0]?.averagePackage || 0;

      // Confidence matching logic:
      // High: rank is <= 85% of maxRank (safe margin)
      // Medium: rank is between 85% and 100% of maxRank (competitive)
      // Unlikely: rank is between 100% and 110% of maxRank (borderline/overshot)
      let matchConfidence: 'High' | 'Medium' | 'Unlikely' = 'Unlikely';
      if (rank <= item.maxRank * 0.85) {
        matchConfidence = 'High';
      } else if (rank <= item.maxRank) {
        matchConfidence = 'Medium';
      }

      return {
        college: {
          id: item.college.id,
          name: item.college.name,
          location: item.college.location,
          rating: averageRating,
          averagePackage,
        },
        course: {
          id: item.course.id,
          name: item.course.name,
          duration: item.course.duration,
          fees: item.course.fees,
        },
        cutoff: {
          round: item.round,
          category: item.category,
          minRank: item.minRank,
          maxRank: item.maxRank,
        },
        matchConfidence,
      };
    });

    return NextResponse.json({ results }, { status: 200 });

  } catch (error) {
    console.error('Admission Predictor API error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
