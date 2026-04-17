
import React, { useState } from 'react';
import { GenerationMode } from './types';
import { generateProductImage } from './services/geminiService';
import { RefreshIcon, SparklesIcon } from './components/Icons';
import ImageUploader from './components/ImageUploader';
import ImageComparator from './components/ImageComparator';
import HistoryTray from './components/HistoryTray';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.Mockup);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [swapImage, setSwapImage] = useState<File | null>(null);
  const [selectedMockup, setSelectedMockup] = useState<string>('on a studio white background with soft shadows');
  
  const [currentGeneratedImageUrl, setCurrentGeneratedImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mockups: { [key: string]: string } = {
    // Standard & Clean
    "White Studio Background": "on a studio white background with soft shadows",
    "Marble Surface": "on a clean marble surface",
    "Minimalist Marble Kitchen": "The product is placed on a clean white marble kitchen countertop against a plain, out-of-focus white wall. The lighting is bright and natural, creating soft shadows. The focus is entirely on the product, with no other objects or distractions in the scene.",
    "Minimalist Marble (Top-Down)": "A top-down, flat-lay photograph of the product centered on a clean white marble countertop. The lighting is bright and even, creating soft, minimal shadows. The background is exclusively the marble surface, ensuring complete focus on the product.",
    "On a Wooden Desk": "on a wooden desk with soft daylight",
    "On a Kitchen Countertop": "on a modern kitchen countertop with natural light",
    "On a Cafe Table": "on an outdoor cafe table with a blurred background",
    
    // Natural & Organic
    "Podium with Stones & Leaves": "on a podium surrounded by smooth stones and green leaves, with soft, clean lighting",
    "Wooden Plate with Flowers & Smoke": "on a wooden plate with chamomile flowers and soft smoke, placed on a gentle linen cloth",
    "Misty Forest Log": "on a mossy log in a misty forest, surrounded by small wildflowers and water droplets",
    "Dramatic Window Lighting": "with dramatic, sharp shadows from a window, creating a high-contrast, artistic look",
    "Concrete Pedestal with Luxe Lighting": "on a concrete pedestal with dramatic, focused lighting and a minimalist, luxurious feel",
    "Hand-held with Pink & Green Aesthetic": "product held by a hand with a background of lush greenery and a pink, bubbly aesthetic",
    
    // Creative Lighting
    "Golden Hour Sunset": "bathed in the warm, golden light of a sunset, creating long, soft shadows",
    "Dark Surface with Spotlight": "on a dark surface with a single, dramatic spotlight shining down from above",
    "Wet Surface with Neon Lights": "on a wet surface reflecting vibrant neon lights, creating a futuristic, dreamy mood",
    "Blurred Bokeh Lights Background": "with a blurred background of twinkling bokeh lights, giving a magical and festive feel",
    "High-Contrast Black & White": "in a high-contrast black and white style, focusing on texture and form",
    "Floating with Abstract Elements": "floating in the air, surrounded by elements like wood fragments and botanicals, against a warm gradient background",

    // Food & Dining (Great for Charcuterie Boards!)
    "Natural Sunlight (Outdoor Table)": "A detailed, close-up shot of the product on a rustic wooden table outdoors, bathed in warm, natural sunlight, with a soft-focus garden background",
    "Sunny Park Picnic": "A product-focused shot of the item on a picnic blanket in a sunny park, surrounded by a bunch of grapes, nuts, and crackers",
    "Cozy Patio (Golden Hour)": "A close-up, appetizing shot of the product on a slate serving board on a cozy patio table during a golden hour sunset",
    "Farmhouse Kitchen Window": "A detailed product shot on a rustic farmhouse table, next to a window with soft morning light filtering through",
    "Festive Holiday Table": "A close-up shot of the product as the centerpiece of a festive holiday dinner table, surrounded by pine cones, candles, and seasonal greenery",
    "Festive Birthday Party": "A close-up, appetizing shot of the product on a festive table during a lively birthday party. The background is filled with colorful balloons, confetti, and a blurred view of a birthday cake and gifts, creating a celebratory and joyful atmosphere.",
    "Corporate Meeting Luncheon": "The product is elegantly displayed as a centerpiece on a long, polished mahogany conference table in a modern, sunlit meeting room. In the blurred background, you can see attendees in professional attire. The scene is clean, sophisticated, and ready for a corporate luncheon.",
    "Elegant Cocktail Party": "The product is showcased on an elegant buffet table at an exclusive private event or cocktail party. The lighting is warm and ambient, with soft-focus twinkling lights and beautifully dressed guests mingling in the background. The atmosphere is sophisticated and intimate.",
  };

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    setError(null);
    setSwapImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      setError("Please upload the product image first.");
      return;
    }

    let finalPrompt = '';
    let finalSwapImage: File | null = null;

    switch (mode) {
      case GenerationMode.Mockup:
        finalPrompt = selectedMockup;
        break;
      case GenerationMode.Swap:
        if (!swapImage) {
            setError("Please upload the scene image you want to use.");
            return;
        }
        finalPrompt = "Take the main product from the first image and place it realistically in the second image, matching the lighting, shadows, and overall style of the scene.";
        finalSwapImage = swapImage;
        break;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const base64Data = await generateProductImage(productImage, finalPrompt, finalSwapImage);
      const newImageUrl = `data:image/png;base64,${base64Data}`;
      setCurrentGeneratedImageUrl(newImageUrl);
      setHistory(prevHistory => [newImageUrl, ...prevHistory]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred while generating the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentGeneratedImageUrl(null);
    setError(null);
  };

  const dataURLtoFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleReuseImage = async (imageUrl: string) => {
    const file = await dataURLtoFile(imageUrl, 'reused-product.png');
    setProductImage(file);
    setProductImageUrl(imageUrl);
    setCurrentGeneratedImageUrl(null);
    setHistory([]);
    setError(null);
  };
  
  if (currentGeneratedImageUrl && productImageUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-4">Your new image is ready!</h1>
          <p className="text-gray-400 mb-8">Move the slider to compare the original image with the AI-generated one.</p>
          
          <ImageComparator beforeImageUrl={productImageUrl} afterImageUrl={currentGeneratedImageUrl} />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={currentGeneratedImageUrl}
              download="generated-product-image.png"
              className="w-full sm:w-auto bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
            >
              Download Image
            </a>
            <button
              onClick={handleCreateNew}
              className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshIcon />
              Create a New Image
            </button>
          </div>
          
          {history.length > 0 && (
            <HistoryTray
              history={history}
              currentImageUrl={currentGeneratedImageUrl}
              onSelect={(imageUrl) => setCurrentGeneratedImageUrl(imageUrl)}
              onReuse={handleReuseImage}
            />
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-gray-800 rounded-full mb-4 ring-2 ring-fuchsia-500/50">
            <SparklesIcon />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">AI Product Photo Studio</h1>
          <p className="mt-4 text-lg text-gray-400">Upload your product photo, choose from ready-made mockups, or blend it into another scene to get professional shots in seconds ✨</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
          <ImageUploader 
            id="product-image"
            label="📦 Base Product Image"
            onFileSelect={(file, url) => {
              setProductImage(file);
              setProductImageUrl(url);
              setHistory([]);
            }}
            previewUrl={productImageUrl}
            isRequired
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">What do you want to create?</label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.values(GenerationMode)).map((value) => {
                const labels = {
                    [GenerationMode.Mockup]: 'Ready Mockups',
                    [GenerationMode.Swap]: 'Scene Swap',
                };
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleModeChange(value)}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500 ${
                      mode === value ? 'bg-fuchsia-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {labels[value]}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="min-h-[15rem] flex flex-col justify-center">
            {mode === GenerationMode.Mockup && (
              <div>
                <label htmlFor="mockup-select" className="block text-sm font-medium text-gray-300 mb-2">Choose a background:</label>
                <select
                  id="mockup-select"
                  value={selectedMockup}
                  onChange={(e) => setSelectedMockup(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  {Object.entries(mockups).map(([name, promptValue]) => (
                    <option key={name} value={promptValue}>{name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {mode === GenerationMode.Swap && (
                <div className="space-y-4">
                    <p className="text-sm text-center text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        We'll take the product from the <b>Base Image</b> and place it into the <b>Scene Image</b> you upload.
                    </p>
                    <ImageUploader
                        id="swap-image"
                        label="📸 Upload Scene Image"
                        onFileSelect={(file) => setSwapImage(file)}
                        isRequired
                    />
                </div>
            )}
          </div>
          
          {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !productImage}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating, one moment...
              </>
            ) : (
              <>
                <SparklesIcon />
                Generate Image
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
