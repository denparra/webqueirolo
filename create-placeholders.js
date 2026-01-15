const fs = require('fs');
const path = require('path');

// Create placeholder SVG images for vehicles
const vehicles = [
    'toyota-4runner-2020',
    'jeep-wrangler-2019',
    'ford-ranger-2021',
    'chevrolet-colorado-2020',
    'nissan-frontier-2021',
    'mitsubishi-l200-2019',
];

const createPlaceholderSVG = (text, width = 800, height = 600) => {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#e5e7eb"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
};

const vehiclesDir = path.join(__dirname, 'public', 'images', 'vehicles');

// Create directory if it doesn't exist
if (!fs.existsSync(vehiclesDir)) {
    fs.mkdirSync(vehiclesDir, { recursive: true });
}

// Create placeholder images
vehicles.forEach((vehicle) => {
    // Main image
    const mainSvg = createPlaceholderSVG(vehicle.replace(/-/g, ' ').toUpperCase());
    fs.writeFileSync(path.join(vehiclesDir, `${vehicle}.jpg`), mainSvg);

    // Additional images
    for (let i = 2; i <= 4; i++) {
        const additionalSvg = createPlaceholderSVG(`${vehicle.replace(/-/g, ' ').toUpperCase()} - Vista ${i}`);
        fs.writeFileSync(path.join(vehiclesDir, `${vehicle}-${i}.jpg`), additionalSvg);
    }
});

console.log('Placeholder images created successfully!');
