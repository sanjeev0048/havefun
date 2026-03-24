/**
 * Pricing Configuration for HavFun Trampoline Park
 * Modify these values to update prices across the entire application.
 */

export const PRICING_CONFIG = {
    // Booking Links
    bookingLink: "https://calendly.com/havfuntrampolinepark", // Replace with your actual link
    // Basic Pricing
    basic: {
        30: 350, // Price for 30 minutes in INR
        60: 550, // Price for 60 minutes in INR
    },

    // Special Offers
    offers: {
        weekdaySpecial: 99,       // Flat price for weekdays 10am-5pm
        offPeakDiscount: 0.3,    // 30% discount for evenings/weekends (stored as decimal)
    },

    // Add-ons
    gripSocks: 80,               // Price for mandatory grip socks in INR

    // Taxes
    gst: 0.05,                   // GST percentage (5% stored as decimal)

    // Operating & Offer Hours (24-hour format)
    hours: {
        weekdayOfferStart: 10,   // 10 AM
        weekdayOfferEnd: 17,     // 5 PM
        offPeakStartDay: 17,     // 5 PM (for weekdays)
    }
};

/**
 * Helper function to calculate the final price based on the selected criteria.
 * This can be used in both the Pricing component and the Waiver flow.
 */
export const calculateBasePrice = (duration: 30 | 60, visitDate: Date, visitHour: number) => {
    const isWeekend = visitDate.getDay() === 0 || visitDate.getDay() === 6;
    const isWeekdayOfferTime = !isWeekend && visitHour >= PRICING_CONFIG.hours.weekdayOfferStart && visitHour < PRICING_CONFIG.hours.weekdayOfferEnd;
    const isAfter5OrWeekend = isWeekend || visitHour >= PRICING_CONFIG.hours.offPeakStartDay;

    if (isWeekdayOfferTime) {
        return PRICING_CONFIG.offers.weekdaySpecial;
    }

    const basicPrice = PRICING_CONFIG.basic[duration];
    if (isAfter5OrWeekend) {
        return Math.round(basicPrice * (1 - PRICING_CONFIG.offers.offPeakDiscount));
    }

    return basicPrice;
};
