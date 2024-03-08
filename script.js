/*
Name: Katherine Maldonado
Project : Arcade Game
*/

// All game assets were created by me except for the iGu.gif, gameAudio, and publicPixel font :)
// ALso feel free to zoom in or out to enlarge the video game image, it will not break the game.

document.addEventListener('DOMContentLoaded', () =>
{

    class CustomSelect
    {
        constructor(originalSelect, onSelectChange)
        {
            this.originalSelect = originalSelect;
            this.customSelect = document.createElement("div");
            this.customSelect.classList.add("select");

            this.originalSelect.querySelectorAll("option").forEach(optionElement =>
            {
                const itemElement = document.createElement("div");
                itemElement.classList.add("select__item");
                itemElement.textContent = optionElement.textContent;

                this.customSelect.appendChild(itemElement);

                if (optionElement.selected)
                {
                    this._select(itemElement);
                }

                itemElement.addEventListener("click", () =>
                {
                    if (this.originalSelect.multiple && itemElement.classList.contains("select__item--selected"))
                    {
                        this._deselect(itemElement);
                    }
                    else
                    {
                        this._select(itemElement);
                        onSelectChange(optionElement.textContent.toLowerCase());
                    }
                });
            });

            this.originalSelect.insertAdjacentElement("afterend", this.customSelect);
            this.originalSelect.style.display = "none";
        }

        _select(itemElement)
        {
            const index = Array.from(this.customSelect.children).indexOf(itemElement);

            if (!this.originalSelect.multiple) {
                this.customSelect.querySelectorAll(".select__item").forEach(el =>
                {
                    el.classList.remove("select__item--selected");
                });
            }

            this.originalSelect.querySelectorAll("option")[index].selected = true;
            itemElement.classList.add("select__item--selected");
        }

        _deselect(itemElement)
        {
            const index = Array.from(this.customSelect.children).indexOf(itemElement);

            this.originalSelect.querySelectorAll("option")[index].selected = false;
            itemElement.classList.remove("select__item--selected");
        }
    }

    let selectedColor = "";

    document.querySelectorAll(".custom-select").forEach(selectElement =>
    {
        new CustomSelect(selectElement, (selectedOption) =>
        {
            selectedColor = selectedOption;
            //console.log("Selected color:", selectedColor);
            updateSpaceShipColor();
        });
    });

    function updateSpaceShipColor()
    {
        const spaceshipColor = document.querySelector('.spaceship');

        if (spaceshipColor)
        {
            const imagePath = `${selectedColor}SpaceShip.png`;
            spaceshipColor.style.backgroundImage = `url("${imagePath}")`;
        }
    }

    const spaceShip = document.querySelector('.spaceship');
    const gameDisplay = document.querySelector('.game-container');
    //const gameVoid = document.querySelector('.void');
    const gameTitle = document.querySelector('.title-container');

    let spaceShipLeft = 220;
    let spaceShipBottom = 100;
    let gravity = 2;
    let isGameOver = false;
    let gap = 400; // Gap between the obstacles
    let gameRunning = false;
    let score = 0;
    let gameAudio = document.createElement("audio");


    gameAudio.src = "arcadeSong.mp3";
    document.body.appendChild(gameAudio);
    gameAudio.volume = 0.03;

    function startGame()
    {
        gameAudio.play();

        if(gameRunning)
        {
            spaceShipBottom -= gravity;

            spaceShip.style.bottom = spaceShipBottom + "px";
            spaceShip.style.left = spaceShipLeft + "px";
            gameTitle.style.display = "none";

            gameAudio.play();
        }
    }

    let gameTimerId = setInterval(startGame, 20);

    //clearInterval(timerId);

    function control(event)
    {
        if(event.keyCode === 32)
        {
            if(!gameRunning)
            {
                gameRunning = true;
                generateObstacle();
            }
            jump();
        }
    }

    function jump()
    {
        if (spaceShipBottom < 500)
        {
            spaceShipBottom += 40;
        }
        spaceShip.style.bottom = spaceShipBottom + "px";

    }
    document.addEventListener("keyup", control);

    function generateObstacle()
    {
        let obstacleLeft = 500;
        let randomHeight = Math.random() * 60;
        let obstacleBottom = randomHeight;

        //Bottom Obstacle
        const obstacle = document.createElement('div');
        gameDisplay.appendChild(obstacle); //Putting a div into the game container

        //Top Obstacle
        const topObstacle = document.createElement('div');
        gameDisplay.appendChild(topObstacle); //Putting a div into the game container

        if(!isGameOver) //Only add class if the game is NOT over
        {
            obstacle.classList.add("obstacle");
            topObstacle.classList.add("topObstacle");
        }

        // Bottom
        obstacle.style.left = obstacleLeft + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';

        // Top
        topObstacle.style.left = obstacleLeft + 'px';
        topObstacle.style.bottom = obstacleBottom + gap + 'px';

        function moveObstacle()
        {
            obstacleLeft -= 2;
            obstacle.style.left = obstacleLeft + 'px';
            topObstacle.style.left = obstacleLeft + 'px';

            if (obstacleLeft === -60) //Once it reaches the end of the screen
            {
                clearInterval(timerId);
                gameDisplay.removeChild(obstacle);
                gameDisplay.removeChild(topObstacle);
            }

            //If reaches the bottom or touches any of the obstacle, gameOver
            if (obstacleLeft > 200 && obstacleLeft < 280 && spaceShipLeft === 220 &&
                (
                    spaceShipBottom < obstacleBottom + 140  //value of how close spaceship touches bottom obstacle
                    || spaceShipBottom > obstacleBottom + gap - 180 //value of how close spaceship touches top obstacle
                )
                || spaceShipBottom === 0)
            {
                const spaceshipStatus = document.querySelector('.spaceship');
                const explosionImagePath = `explosion.gif`;

                spaceshipStatus.style.backgroundImage = `url("${explosionImagePath}")`;
                spaceshipStatus.style.backgroundSize = 'fill';

                gameOver();

                clearInterval(timerId);
                clearTimeout(scoreTimer);
            }
        }

        let timerId = setInterval(moveObstacle, 20);
        let scoreTimer = setTimeout(updateScore, 3000);

        if(!isGameOver) //if game is not over generate an obstacle every 2 seconds
        {
            setTimeout(generateObstacle, 2000);
        }
    }

    function updateScore()
    {
        score++;
        document.getElementById("score").textContent = "Score: " + score;
    }

    function gameOver()
    {
        const gameOverContainer = document.querySelector(".game-over-container");

        //console.log("GAME OVER");
        if (gameOverContainer)
        {
            gameOverContainer.style.display = "block";
        }

        clearInterval(gameTimerId);
        isGameOver = true;

        document.removeEventListener("keyup", control);
    }

    document.getElementById("restartButton").addEventListener("click", restartGame);

    function restartGame()
    {
        location.reload();
    }
});