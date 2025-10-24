// controllers/hero/helpers/backgroundHelper.js

export const buildBackgroundObject = (body) => {
    const { backgroundType, backgroundColor1, backgroundColor2, backgroundDirection } = body;

    if (backgroundType === 'gradient') {
        return {
            type: 'gradient',
            color1: backgroundColor1,
            color2: backgroundColor2,
            direction: backgroundDirection
        };
    }
    
    // Default to solid
    return {
        type: 'solid',
        color1: backgroundColor1
    };
};