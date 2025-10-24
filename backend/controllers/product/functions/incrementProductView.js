import Product from '../../../models/product.model.js';

/**
 * Increments the view count of a product if the user's IP has not viewed it before.
 * This prevents counting multiple views from the same user for the same product.
 */
export const incrementProductView = async (req, res) => {
    try {
        const { id } = req.params;
        // req.ip retrieves the user's IP address from the request.
        // This is enabled by default in Express.
        const userIp = req.ip;

        // Find the specific product that the user is viewing.
        const product = await Product.findById(id);

        // If the product doesn't exist, send a 404 Not Found error.
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // --- THE CORE LOGIC ---
        // Check if the user's IP address is already in the 'viewedBy' array for THIS product.
        // The .includes() method returns true if the IP is found, and false otherwise.
        if (!product.viewedBy.includes(userIp)) {
            // If the IP is NOT in the array, it's a unique view.
            
            // 1. Increment the view count by 1.
            product.views += 1;
            
            // 2. Add the user's IP to the 'viewedBy' array to record that they have now seen it.
            product.viewedBy.push(userIp);
            
            // 3. Save the changes back to the database.
            await product.save();
        }
        // If the user's IP is already in the 'viewedBy' array, the code inside the 'if' block
        // is skipped entirely, and the view count is NOT incremented.

        // Send a success response. We send back the current number of views,
        // which will be the updated number for a new viewer or the existing number for a returning viewer.
        res.status(200).json({ 
            message: 'View count processed successfully.', 
            views: product.views 
        });

    } catch (error) {
        // If any server error occurs during the process, log it and send a 500 error response.
        console.error("Error in incrementProductView:", error);
        res.status(500).json({ message: 'Error updating view count.', error: error.message });
    }
};