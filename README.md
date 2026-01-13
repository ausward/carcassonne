# Carcassonne

A web-based implementation of the popular board game Carcassonne, built with Node.js and vanilla JavaScript.

## Description

This project recreates the classic tile-laying board game Carcassonne in a web browser. Players place tiles to build roads, cities, and monasteries, scoring points based on completed features.

## Features

- Interactive tile placement and rotation
- Intelligent auto-placement for roads
- Shuffle deck functionality
- Real-time scoring system
- Reset game option
- Keyboard shortcuts for enhanced gameplay
- Responsive web interface

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ausward/carcassonne.git
   cd carcassonne
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Click on grid cells to place tiles or rotate existing ones
4. Drag tiles from the preview area to the grid
5. Use keyboard shortcuts for quick actions:
   - `n/N`: Auto-place road tile intelligently
   - `a/A`: Auto-place all remaining tiles
   - `s/S`: Update and display score

## Game Controls

### Mouse Actions
- **Click grid cell**: Place tile from deck or rotate existing tile
- **Drag from preview**: Place tile on grid

### Buttons
- **Shuffle Deck**: Rearrange next 3 tiles
- **Reset Game**: Clear board and restart
- **?**: Show/Hide help panel

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS

## Project Structure

```
carcassonne/
├── index.js              # Express server
├── package.json          # Project dependencies and scripts
└── public/
    ├── index.html        # Main game interface
    ├── css/
    │   └── style.css     # Game styling
    └── js/
        └── script.js     # Game logic
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the ISC License.