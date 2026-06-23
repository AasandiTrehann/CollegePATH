import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams; // represents collegeId or savedCollegeId

    const token = request.cookies.get('token')?.value;
    const verified = token ? await verifyJWT(token) : null;

    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    // Try deleting using user-college composite unique constraint first
    try {
      await prisma.savedCollege.delete({
        where: {
          userId_collegeId: {
            userId: verified.userId,
            collegeId: id
          }
        }
      });
      return NextResponse.json({ message: 'College removed from shortlist successfully.' }, { status: 200 });
    } catch (e) {
      // Fallback: Try deleting by the savedCollege primary ID if it matches this user
      const savedRecord = await prisma.savedCollege.findUnique({
        where: { id }
      });

      if (!savedRecord || savedRecord.userId !== verified.userId) {
        return NextResponse.json({ error: 'Saved college record not found or unauthorized.' }, { status: 404 });
      }

      await prisma.savedCollege.delete({
        where: { id }
      });
      return NextResponse.json({ message: 'College removed from shortlist successfully.' }, { status: 200 });
    }

  } catch (error) {
    console.error('Delete Saved College error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
