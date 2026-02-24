import { supabase } from './supabase';

const VISITOR_ID_KEY = 'mge_visitor_id';

/**
 * Gets or creates a persistent visitor ID for the current browser
 */
const getVisitorId = (): string => {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
};

/**
 * Tracks a page view or an item view
 * @param carId Optional ID of the car being viewed
 */
export const trackView = async (carId?: string) => {
    try {
        const visitorId = getVisitorId();

        const { error } = await supabase
            .from('page_views')
            .insert([
                {
                    visitor_id: visitorId,
                    car_id: carId || null
                }
            ]);

        if (error) {
            console.error('Analytics error:', error);
        }
    } catch (err) {
        console.error('Failed to track view:', err);
    }
};
