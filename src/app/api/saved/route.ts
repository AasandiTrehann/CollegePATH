import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

// 1. GET: Fetch user's saved colleges
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const verified = token ? await verifyJWT(token) : null;

    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: verified.userId },
      include: {
        college: {
          include: {
            courses: true,
            placements: {
              where: { year: 2023 }
            },
            reviews: {
              select: { rating: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map saved colleges to calculate dynamic rating averages and format
    const formattedSaved = savedColleges.map((sc: any) => {
      const ratings = sc.college.reviews.map((r: { rating: number }) => r.rating);
      const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length) * 10) / 10
        : 0;

      const { reviews, ...collegeData } = sc.college;
      return {
        savedId: sc.id,
        savedAt: sc.createdAt,
        college: {
          ...collegeData,
          rating: averageRating,
          averagePackage: sc.college.placements[0]?.averagePackage || 0,
        }
      };
    });

    return NextResponse.json({ saved: formattedSaved }, { status: 200 });

  } catch (error) {
    console.error('Fetch Saved Colleges error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

// 2. POST: Shortlist a new college
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const verified = token ? await verifyJWT(token) : null;

    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { collegeId } = await request.json();

    if (!collegeId) {
      return NextResponse.json({ error: 'College ID is required.' }, { status: 400 });
    }

    // Verify college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId }
    });

    if (!collegeExists) {
      return NextResponse.json({ error: 'College not found.' }, { status: 404 });
    }

    // Check if already saved
    const alreadySaved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: verified.userId,
          collegeId
        }
      }
    });

    if (alreadySaved) {
      return NextResponse.json({ message: 'College is already in your shortlist.', saved: alreadySaved }, { status: 200 });
    }

    // Save college
    const saved = await prisma.savedCollege.create({
      data: {
        userId: verified.userId,
        collegeId
      }
    });

    return NextResponse.json({ message: 'College saved successfully.', saved }, { status: 201 });

  } catch (error) {
    console.error('Create Saved College error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
