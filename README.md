# Latency Topology Visualizer
This project is a 3D interactive globe-based visualization tool built with Next.js and Three.js, displaying real-time and historical internet latency between exchange servers and major cloud provider regions (AWS, Azure, GCP).

---

## Getting Started (Run Locally)
Follow these steps to run the project on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/JayPalkar/latency-topology-visualizer.git
cd latency-topology-visualizer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Create a .env.local file in the root and add the following:
```bash
# Replace with your actual API keys or tokens if required
NEXT_PUBLIC_CLOUDFLARE_API_TOKEN=your_cloudflare_api-token
```

### 4. Start the Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the application.

---

## Dependencies & Libraries Used

| Library                         | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| `next` + `react` + `typescript` | Core web app stack                                            |
| `three`                         | WebGL rendering and 3D scene                                  |
| `@react-three/fiber`            | React bindings for Three.js                                   |
| `@react-three/drei`             | Useful helpers for Three.js (e.g., OrbitControls, Environment)|
| `react-spring`                  | Animations for globe pulses                                   |
| `context API`                   | State management (context used here)                          |
| `axios`                         | Data fetching from RIPE Atlas                                 |
| `chartjs`                       | Chart rendering if using `LatencyChart`                       |
| `tailwindcss`                   | Styling and layout                                            |

---

## Assumptions Made

- Latency Source: Real-time and historical latency data is fetched using the Cloudflare radar api
- Geographic Coordinates: Exchange and cloud region locations are hardcoded or fetched from static data.
- Performance: Data polling is limited and debounced to prevent unnecessary renders or API overuse.
- Cloud Regions: Cloud provider regions (AWS, GCP, Azure) are mapped based on public region codes and coordinates.
- Browser Support: Best viewed on modern desktop browsers (Chrome, Firefox, Edge). Mobile view is functional but optimized for desktop.
