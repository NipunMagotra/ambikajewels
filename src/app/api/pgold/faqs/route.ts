import { NextResponse } from 'next/server';
import { pgoldStore } from '@/lib/pgoldStore';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      const isAuth = await verifyAdminAuth();
      if (!isAuth) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }
      const faqs = await pgoldStore.getAllFAQsAdmin();
      return NextResponse.json({ success: true, data: faqs });
    }

    const faqs = await pgoldStore.getFAQs();
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching P-Gold FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question, answer, category, sort_order, is_active, id } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, message: 'Question cannot be empty' },
        { status: 400 }
      );
    }

    if (!answer || !answer.trim()) {
      return NextResponse.json(
        { success: false, message: 'Answer cannot be empty' },
        { status: 400 }
      );
    }

    const savedFaq = await pgoldStore.saveFAQ({
      id,
      question: question.trim(),
      answer: answer.trim(),
      category: category || 'general',
      sort_order: Number(sort_order) || 0,
      is_active: is_active !== undefined ? Boolean(is_active) : true
    });

    return NextResponse.json({
      success: true,
      message: id ? 'FAQ updated successfully' : 'FAQ created successfully',
      data: savedFaq
    });
  } catch (error) {
    console.error('Error saving FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save FAQ' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'FAQ ID is required for deletion' },
        { status: 400 }
      );
    }

    await pgoldStore.deleteFAQ(id);
    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
