// src/app/api/restaurants/[restaurantId]/landing-page/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint to fetch landing page data for a restaurant
export async function GET(
  req: Request,
  { params }: { params: Promise<{ restaurantId: string }> | { restaurantId: string } }
) {
  try {
    // Await the params object
    const resolvedParams = await params;
    const restaurantId = resolvedParams.restaurantId;

    // Fetch the landing page data including relations
    const landingPage = await prisma.landingPage.findUnique({
      where: {
        restaurantId,
      },
      include: {
        popularItems: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        reviews: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        testimonials: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        stats: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        faqs: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: "Landing page not found for this restaurant" },
        { status: 404 }
      );
    }

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return NextResponse.json(
      { error: "Failed to fetch landing page data" },
      { status: 500 }
    );
  }
}

// POST endpoint to create or update a landing page
export async function POST(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;
    const data = await req.json();

    // Check if the restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Extract main landing page data
    const {
      title,
      subtitle,
      description,
      wifiCode,
      preparationTime,
      googleReviewLink,
      appDeepLink,
      logoPath,
      backgroundImage,
      popularItems,
      reviews,
      testimonials,
      stats,
      faqs,
      isActive = true,
      googlePreviewDescription,
      popularItemsTitle,
      popularItemsSubtitle,
    } = data;

    // Check if a landing page already exists for this restaurant
    const existingLandingPage = await prisma.landingPage.findUnique({
      where: { restaurantId },
    });

    // Create or update the landing page
    let landingPage;
    if (existingLandingPage) {
      // Update existing landing page
      landingPage = await prisma.landingPage.update({
        where: { id: existingLandingPage.id },
        data: {
          title,
          subtitle,
          description,
          wifiCode,
          preparationTime,
          googleReviewLink,
          appDeepLink,
          logoPath,
          backgroundImage,
          isActive,
          googlePreviewDescription,
          popularItemsTitle,
          popularItemsSubtitle,
        },
      });
    } else {
      // Create new landing page
      landingPage = await prisma.landingPage.create({
        data: {
          restaurantId,
          title,
          subtitle,
          description,
          wifiCode,
          preparationTime,
          googleReviewLink,
          appDeepLink,
          logoPath,
          backgroundImage,
          isActive,
          googlePreviewDescription,
          popularItemsTitle,
          popularItemsSubtitle,
        },
      });
    }

    // Handle popular items (if provided)
    if (popularItems && Array.isArray(popularItems)) {
      // Delete existing items if we're updating
      if (existingLandingPage) {
        await prisma.popularItem.deleteMany({
          where: { landingPageId: landingPage.id },
        });
      }

      // Create new items
      await Promise.all(
        popularItems.map((item, index) =>
          prisma.popularItem.create({
            data: {
              landingPageId: landingPage.id,
              title: item.title,
              price: item.price,
              description: item.description,
              imagePath: item.imagePath,
              isActive: item.isActive ?? true,
              order: item.order ?? index,
            },
          })
        )
      );
    }

    // Handle reviews (if provided)
    if (reviews && Array.isArray(reviews)) {
      // Delete existing reviews if we're updating
      if (existingLandingPage) {
        await prisma.review.deleteMany({
          where: { landingPageId: landingPage.id },
        });
      }

      // Create new reviews
      await Promise.all(
        reviews.map((review, index) =>
          prisma.review.create({
            data: {
              landingPageId: landingPage.id,
              name: review.name,
              title: review.title,
              content: review.content,
              rating: review.rating ?? 5.0,
              isActive: review.isActive ?? true,
              order: review.order ?? index,
            },
          })
        )
      );
    }

    // Handle testimonials (if provided)
    if (testimonials && Array.isArray(testimonials)) {
      // Delete existing testimonials if we're updating
      if (existingLandingPage) {
        await prisma.testimonial.deleteMany({
          where: { landingPageId: landingPage.id },
        });
      }

      // Create new testimonials
      await Promise.all(
        testimonials.map((testimonial, index) =>
          prisma.testimonial.create({
            data: {
              landingPageId: landingPage.id,
              content: testimonial.content,
              isActive: testimonial.isActive ?? true,
              order: testimonial.order ?? index,
            },
          })
        )
      );
    }

    // Handle stats (if provided)
    if (stats && Array.isArray(stats)) {
      // Delete existing stats if we're updating
      if (existingLandingPage) {
        await prisma.landingPageStat.deleteMany({
          where: { landingPageId: landingPage.id },
        });
      }

      // Create new stats
      await Promise.all(
        stats.map((stat, index) =>
          prisma.landingPageStat.create({
            data: {
              landingPageId: landingPage.id,
              title: stat.title,
              value: stat.value,
              isActive: stat.isActive ?? true,
              order: stat.order ?? index,
            },
          })
        )
      );
    }

    // Handle FAQs (if provided)
    if (faqs && Array.isArray(faqs)) {
      // Delete existing FAQs if we're updating
      if (existingLandingPage) {
        await prisma.fAQ.deleteMany({
          where: { landingPageId: landingPage.id },
        });
      }

      // Create new FAQs
      await Promise.all(
        faqs.map((faq, index) =>
          prisma.fAQ.create({
            data: {
              landingPageId: landingPage.id,
              question: faq.question,
              answer: faq.answer,
              isActive: faq.isActive ?? true,
              order: faq.order ?? index,
            },
          })
        )
      );
    }

    // Fetch the complete landing page with all relations
    const completeLandingPage = await prisma.landingPage.findUnique({
      where: { id: landingPage.id },
      include: {
        popularItems: {
          orderBy: { order: "asc" },
        },
        reviews: {
          orderBy: { order: "asc" },
        },
        testimonials: {
          orderBy: { order: "asc" },
        },
        stats: {
          orderBy: { order: "asc" },
        },
        faqs: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({
      message: existingLandingPage
        ? "Landing page updated successfully"
        : "Landing page created successfully",
      landingPage: completeLandingPage,
    });
  } catch (error) {
    console.error("Error creating/updating landing page:", error);
    return NextResponse.json(
      { error: "Failed to create/update landing page" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a landing page
export async function DELETE(
  req: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;

    // Check if the landing page exists
    const landingPage = await prisma.landingPage.findUnique({
      where: { restaurantId },
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: "Landing page not found for this restaurant" },
        { status: 404 }
      );
    }

    // Delete the landing page (related items will be deleted due to cascade)
    await prisma.landingPage.delete({
      where: { id: landingPage.id },
    });

    return NextResponse.json({
      message: "Landing page deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting landing page:", error);
    return NextResponse.json(
      { error: "Failed to delete landing page" },
      { status: 500 }
    );
  }
}