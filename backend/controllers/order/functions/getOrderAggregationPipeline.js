// controllers/order/functions/getOrderAggregationPipeline.js

export const getOrderAggregationPipeline = (matchConditions = {}) => [
    // Stage 1: Match orders based on given criteria (e.g., status, ID)
    { $match: matchConditions },

    // Stage 2: Deconstruct the products array to process each item
    { $unwind: '$products' },

    // Stage 3: Lookup product details (replaces populate)
    {
        $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.productInfo'
        }
    },
    // Ensure productInfo is an object, not an array
    { $unwind: '$products.productInfo' },

    // Stage 4: Lookup category details for the product (nested populate)
    {
        $lookup: {
            from: 'categories',
            localField: 'products.productInfo.category',
            foreignField: '_id',
            as: 'products.productInfo.categoryInfo'
        }
    },
    // Ensure categoryInfo is an object
    { $unwind: '$products.productInfo.categoryInfo' },
    
    // Stage 5: Group back to the original order structure
    {
        $group: {
            _id: '$_id',
            root: { $first: '$$ROOT' },
            products: {
                $push: {
                    quantity: '$products.quantity',
                    selectedColor: '$products.selectedColor',
                    selectedSize: '$products.selectedSize',
                    product: {
                        _id: '$products.productInfo._id',
                        name: '$products.productInfo.name',
                        thumbnailUrl: '$products.productInfo.thumbnailUrl',
                        price: '$products.productInfo.price',
                        category: {
                            _id: '$products.productInfo.categoryInfo._id',
                            name: '$products.productInfo.categoryInfo.name'
                        }
                    }
                }
            }
        }
    },

    // Stage 6: Replace the root with a merged object containing the new populated products
    {
        $replaceRoot: {
            newRoot: {
                $mergeObjects: ['$root', { products: '$products' }]
            }
        }
    },
    
    // Stage 7: Sort the final results by creation date
    { $sort: { createdAt: -1 } },
];