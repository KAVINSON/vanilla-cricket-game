# VanillaJS Cricket Game

A simple, complete, and responsive cricket batting game built using only vanilla HTML, CSS, and JavaScript.

## 🔗 Submission Links

* **Live Deployment Link:** [INSERT YOUR LIVE DEPLOYMENT URL HERE]
* **GitHub Repository Link:** [INSERT YOUR GITHUB REPOSITORY URL HERE]

## 📝 Game Instructions

1.  **Start Game:** Click the "Start Game" button to begin the first innings.
2.  **Batting:** The player bats first. The goal is to set a high target.
3.  **The Play:** In each ball, the player chooses a run (0, 1, 2, 3, 4, or 6). Simultaneously, the computer "bowls" a random number (0, 1, 2, 3, 4, or 6).
    * **Runs Scored:** If the **player's chosen run is DIFFERENT** from the computer's bowl, the player scores the chosen runs.
    * **Wicket:** If the **player's chosen run is THE SAME** as the computer's bowl, it's a wicket (**OUT!**).
4.  **Innings End:** The first innings ends when the player loses **5 wickets** or completes **5 overs (30 balls)**, setting the target.
5.  **Chasing:** The player then chases the target score in the second innings under the same rules (5 wickets or 5 overs).
6.  **Win Condition:** Win by either surpassing the target or getting the computer out (which doesn't happen in this simplified version, only by meeting the run target). The game checks the score against the target after every ball.

## 🛠️ Technologies Used

* **HTML5 (index.html):** For the game structure and elements.
* **CSS3 (css/style.css):** For styling, layout, responsiveness, and wicket/ball animations.
* **Vanilla JavaScript (js/script.js):** For all game logic, state management, event handling, and real-time scoreboard updates.
