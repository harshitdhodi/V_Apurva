import { connectDB } from "@/lib/db";
import ClickEvent from "@/lib/models/clickEvent";

export async function POST(req) {
  try {
    await connectDB();
    
    const { 
      eventType, 
      userId, 
      sessionId, 
      page, 
      buttonName, 
      productId, 
      productName, 
      userAgent, 
      ipAddress, 
      referrer,
      metadata 
    } = await req.json();

    // Validate required field
    if (!eventType) {
      return Response.json(
        { success: false, error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Define fields to check for duplicates
    const duplicateQuery = {
      ipAddress,
      eventType,
      page: page || null,
      buttonName: buttonName || null,
      productId: productId || null,
      productName: productName || null
    };

    // Look for existing event
    const existingEvent = await ClickEvent.findOne(duplicateQuery);

    if (existingEvent) {
      // Increment repetition count for existing event
      existingEvent.repetitionCount += 1;
      existingEvent.timestamp = new Date(); // Update timestamp
      await existingEvent.save();
      
      return Response.json({ 
        success: true, 
        message: 'Event repetition recorded',
        eventId: existingEvent._id,
        repetitionCount: existingEvent.repetitionCount
      });
    }

    // Create new event if no duplicate found
    const clickEvent = new ClickEvent({
      eventType,
      userId,
      sessionId,
      page,
      buttonName,
      productId,
      productName,
      userAgent,
      ipAddress,
      referrer,
      metadata,
      timestamp: new Date(),
      repetitionCount: 1
    });

    // Save to database
    await clickEvent.save();
    
    return Response.json({ 
      success: true, 
      message: 'Event tracked successfully',
      eventId: clickEvent._id,
      repetitionCount: clickEvent.repetitionCount
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('id');

    if (!eventId) {
      return Response.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the event
    const deletedEvent = await ClickEvent.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return Response.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Event deleted successfully',
      deletedEventId: eventId
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}