# python-service/app.py

from flask import Flask, request, send_file
from flask_cors import CORS
from rembg import remove
import io
from PIL import Image

app = Flask(__name__)
# Allow requests from your React frontend (http://localhost:5173)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/remove-bg', methods=['POST'])
def remove_bg_route():
    if 'image' not in request.files:
        return {"error": "No image file provided."}, 400

    file = request.files['image']

    if file.filename == '':
        return {"error": "No image file selected."}, 400

    input_bytes = file.read()

    try:
        print("Removing background with advanced alpha matting...")
        
        # --- MODIFIED BLOCK START ---
        # Step 1: Remove the background using alpha matting for better edge detection.
        # This tells rembg to be more careful around the object's edges.
        # - foreground_threshold: How confident to be that a pixel is foreground (0-255). Higher is more strict.
        # - background_threshold: How confident to be that a pixel is background. Lower is more strict.
        png_output_bytes = remove(
            input_bytes,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10
        )
        print("Background removal successful. Now converting to WebP...")
        # --- MODIFIED BLOCK END ---

        # Step 2: Open the improved PNG output using Pillow
        img = Image.open(io.BytesIO(png_output_bytes))

        # Step 3: Convert and save the image as WebP into an in-memory buffer
        webp_buffer = io.BytesIO()
        img.save(webp_buffer, format="WEBP", quality=90) # Increased quality slightly for product images
        webp_buffer.seek(0)
        print("Conversion to WebP successful.")

        # Step 4: Send the processed WebP image back
        return send_file(
            webp_buffer,
            mimetype='image/webp',
            as_attachment=True,
            download_name='background-removed.webp'
        )

    except Exception as e:
        print(f"Error during background removal or conversion: {e}")
        return {"error": "An error occurred during processing."}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)