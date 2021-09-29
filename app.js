// EventListener executed when the web page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div') // Define "squares" as all the "grid div" class
    const resultDisplay = document.querySelector('#result') // Define "resultDisplay" as the element with the id "result"

    // Define the play area's parameters
    let width = 15
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let alienInvadersTakenDown = []
    let result = 0
    let direction = 1
    let invaderId

    // Define the alien invaders positions
    const alienInvaders = [
        0,1,2,3,4,5,6,7,8,9, // 1st line of 10 aliens
        15,16,17,18,19,20,21,22,23,24, // 2nd line of 10 aliens
        30,31,32,33,34,35,36,37,38,39 // 3rd line of 10 aliens
    ]

    // Draw the alien invaders inside the squares define earlier
    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'))

    // Draw the shooter
    squares[currentShooterIndex].classList.add('shooter')

    // Move the shooter along a line
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter') // The shooter is removed from its current position
        switch(e.keyCode) { // Switch related to two distinct events
            case 37: // Left key code
                if(currentShooterIndex % width !== 0) currentShooterIndex -=1 // If the shooter is not on the play area's left edge then move left
                break
            case 39: // Right key code
                if(currentShooterIndex % width < width -1) currentShooterIndex +=1 // If the shooter is not on the play area's right edge then move right
                break
        }
        squares[currentShooterIndex].classList.add('shooter') // The shooter is moved to its new location
    }
    document.addEventListener('keydown', moveShooter) // If a key is pressed then moveShooter() is called

    // Move the alien invaders (from one side to the other)
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0 // Define the left edge's value
        const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1 // Define the right edge's value

        if((leftEdge && direction === -1) || (rightEdge && direction === 1)) { // If the invaders arrive to the left/right edge
            direction = width // The aliens position remains the same
        } else if (direction === width) { // If the aliens direction equals the width then...
            if (leftEdge) direction = 1 // They are asked to move the other way - right if they are on the left edge...
            else direction = -1 // Left if they are on the right edge
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) { // The aliens are removed as they are moving from one side to the other
            squares[alienInvaders[i]].classList.remove('invader')
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) { // The aliens direction is updated every interval in order to make them move
            alienInvaders[i] += direction
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) { // "New" aliens are added in order to make the alien army move from side to side
            if (!alienInvadersTakenDown.includes(i)) { // If aliens are not taken down then...
                squares[alienInvaders[i]].classList.add('invader') // "New" aliens are added in order to make the pack move
            }
        }

        // Decide that the game is over
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) { // If an invader position equald the shooter's one then it's game over
            resultDisplay.textContent = 'Game Over' // This mesage is displayed
            squares[currentShooterIndex].classList.add('boom') // The class 'boom' is added to the shooter's position for some animation
            clearInterval(invaderId) // Aliens do not move anymore
        }

        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if (alienInvaders[i] > (squares.length - (width-1))) { // If the aliens missed the shooter but touched the bottom of the grid then the games is over
                resultDisplay.textContent = 'Game Over' // This mesage is displayed
                clearInterval(invaderId) // Aliens do not move anymore
            }
        }

        // Decide a win
        if (alienInvadersTakenDown.length === alienInvaders.length) { // If the taken down aliens list's length equals the alien one then it's a win
            resultDisplay.textContent = 'You Win' // This mesage is displayed
            clearInterval(invaderId) // Not move are usefull now
        }
    }

    invaderId = setInterval(moveInvaders, 500) // Set the interval with calling moveInvaders() and setting an interval of 500ms

    // Shoot at aliens
    function shoot(e) {
        let laserId // Define the let varibale for the laser blaster
        let currentLaserIndex = currentShooterIndex // Make the laser blaster leave from the shooter's current position

        // Move the laser from the shooter to the alien Invader
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser') // Remove the laser icon from the current position
            currentLaserIndex -= width // Make it go one square up
            squares[currentLaserIndex].classList.add('laser') // Add the laser to thus new square

            if (squares[currentLaserIndex].classList.contains('invader')) { // If the laser meets with an invader
                squares[currentLaserIndex].classList.remove('laser') // Remove the laser icon
                squares[currentLaserIndex].classList.remove('invader') // Remove the alien icon
                squares[currentLaserIndex].classList.add('boom') // Add a 'boom' effect to this collision

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250) // The 'boom' effect last for 250ms after the blast and then fades out
                clearInterval(laserId) // The laser id is reset in order to shoot an other laser from the shooter's position without errors

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex) // The aline taken down lists refers to aliens that met with a laser blast
                alienInvadersTakenDown.push(alienTakenDown) // New aliens taken down are added to the list
                result++ // Points are added to the player's score
                resultDisplay.textContent = result // The points displays is updated
            }

            if (currentLaserIndex < width) { // If the laser blast arrives at the top edge of the play area then...
                clearInterval(laserId) // The laser id is reset in order to shoot an other laser from the shooter's position without errors
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100) // The laser blaster is removed from the play area
            }
        }

        switch(e.keyCode) {
            case 32: // If the space bar is pressed then...
                laserId = setInterval(moveLaser, 100) // A laser blast is shot, the highest rate being one shoot per 100ms
                break
        }
    }

    document.addEventListener('keyup', shoot)
    
})