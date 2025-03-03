// app/api/external/landing-page/[hashId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/middleware/api-auth';

export async function GET(
  request: Request,
  { params }: { params: { hashId: string } }
) {
  // Check API key first
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { hashId } = params;
    
    if (!hashId) {
      return NextResponse.json({ error: 'Missing hashId parameter' }, { status: 400 });
    }

    // Find the restaurant by hashId
    const restaurant = await prisma.restaurant.findFirst({
      where: { hashId: hashId },
      select: {
        id: true,
        name: true,
        slug: true,
        hashId: true,
        externalSnapfoodId: true,
        address: true,
        phone: true,
        email: true,
        isOpen: true, 
        latitude: true,
        longitude: true,
        landingPage: {
          include: {
            popularItems: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            },
            reviews: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            },
            testimonials: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            },
            stats: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            },
            faqs: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    if (!restaurant.landingPage || !restaurant.landingPage.isActive) {
      return NextResponse.json({ error: 'Landing page not available or inactive' }, { status: 404 });
    }

    // Prepare a clean, web-safe version of the landing page data
    const landingPageData = {
      restaurant: {
        name: restaurant.name,
        hashId: restaurant.hashId,
        slug: restaurant.slug,
        address: restaurant.address,
        phone: restaurant.phone,
        externalSnapfoodId: restaurant.externalSnapfoodId,
        isOpen: restaurant.isOpen,
        location: restaurant.latitude && restaurant.longitude ? {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude
        } : null
      },
      landingPage: {
        title: restaurant.landingPage.title || restaurant.name,
        subtitle: restaurant.landingPage.subtitle,
        description: restaurant.landingPage.description,
        wifiCode: restaurant.landingPage.wifiCode,
        preparationTime: restaurant.landingPage.preparationTime,
        deliveryTimeMinutes: restaurant.landingPage.deliveryTimeMinutes, 
        googleReviewLink: restaurant.landingPage.googleReviewLink,
        appDeepLink: restaurant.landingPage.appDeepLink,
        logoPath: restaurant.landingPage.logoPath,
        backgroundImage: restaurant.landingPage.backgroundImage,
        googlePreviewDescription: restaurant.landingPage.googlePreviewDescription,
        popularItemsTitle: restaurant.landingPage.popularItemsTitle || "Popular Menu Items",
        popularItemsSubtitle: restaurant.landingPage.popularItemsSubtitle || "Our customers' favorite dishes",
        popularItems: restaurant.landingPage.popularItems.map(item => ({
          title: item.title,
          price: item.price,
          description: item.description,
          imagePath: item.imagePath
        })),
        reviews: restaurant.landingPage.reviews.map(review => ({
          name: review.name,
          title: review.title,
          content: review.content,
          rating: review.rating
        })),
        testimonials: restaurant.landingPage.testimonials.map(testimonial => ({
          content: testimonial.content
        })),
        stats: restaurant.landingPage.stats.map(stat => ({
          title: stat.title,
          value: stat.value
        })),
        faqs: restaurant.landingPage.faqs ? restaurant.landingPage.faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer
        })) : []
      }
    };

    return NextResponse.json(landingPageData);
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch landing page',
      details: error
    }, { status: 500 });
  }
}