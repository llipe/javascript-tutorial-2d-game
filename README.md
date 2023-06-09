# 2D Platformer - Learning JS in the process #
## Overview
This project aims to develop a simple 2D platform game that provides a fun and engaging way for people to learn software development. Unlike traditional coding exercises like building REST APIs or calculators, this game offers a visually appealing and interactive experience. The game will be built using JavaScript and will feature simple battle mechanics.

## How to read the execution
The central starting point of the application is the index.js file, serving as the main entry point. Within this file, two crucial objects are instantiated: a Game object and a Controller object. The index.js file seamlessly connects these components by relaying keyDowns and keyUps events to the Controller, which, in turn, maps them to corresponding actions within the game.

Digging deeper into the codebase, the Game object contains a Ninja instance that inherits from the Character class. While the Character class encapsulates most of the shared behaviors, the Ninja class takes on the responsibility of implementing specific states and actions unique to this character archetype. This modular design allows for clear separation of concerns, enabling the Character class to cater to multiple entities while granting the Ninja class the flexibility to introduce its own distinct functionalities.

## How to run?
```bash
cd to-main-folder
npm install

npm run start
```

## Features
2D platform game: The game will be set in a 2D environment with platforms, obstacles, and enemies for the player to navigate.
* **Battle mechanics**: The game will incorporate simple battle mechanics, allowing the player to engage in combat with enemies.
* **JavaScript implementation**: The game will be developed using JavaScript, making it accessible for beginners and showcasing the power and flexibility of the language.
* **Interactive gameplay**: The game will provide an interactive and immersive experience for players, encouraging them to experiment and explore the game world.
* **Learning-oriented**: The game will serve as a tool for learning software development, offering insights into game development concepts and JavaScript programming techniques.

## Installation
> :warning: **Section needs to be updated**: Be very careful here!

* Clone the repository: git clone https://github.com/llipe/javascript-tutorial-2d-game.git
* Navigate to the project directory: cd simple-2d-platform-game
* Open the game in your preferred web browser.
Usage
* Start the game by opening the index.html file in your web browser.
* Use the arrow keys to move the player character.
* Jump on platforms and avoid obstacles to progress through the levels.
* Engage in battles with enemies by pressing the attack button.
* Aim to reach the end of each level while defeating enemies and collecting power-ups.
* Experiment with the game mechanics, explore different strategies, and have fun while learning!

## Contributing ##
Contributions to this project are welcome. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch: git checkout -b feature/your-feature
3. Make your changes and commit them: git commit -m 'Add some feature'
4. Push to the branch: git push origin feature/your-feature
5. Submit a pull request detailing your changes.

## License ##
This project is licensed under the MIT License.

## Acknowledgements ##
We would like to acknowledge the following resources that inspired and helped in the development of this project:

* Assets, including characters, tiles and backgrounds, were downloaded from the awesome freebies offered by [Game Art 2D](https://www.gameart2d.com/freebies.html)

## Contact
For any questions or inquiries, please contact the project team at [tbd at domain].