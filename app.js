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
        0,1,2,3,4,5,6,7,8,9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
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
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            squares[alienInvaders[i]].classList.remove('invader')
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            alienInvaders[i] += direction
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if (!alienInvadersTakenDown.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader')
            }
        }

        // Decide that the game is over
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            resultDisplay.textContent = 'Game Over'
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
        }

        for (let i = 0; i <= alienInvaders.length -1; i++) {
            // If the aliens missed the shooter but touched the bottom of the grid then the games is over
            if (alienInvaders[i] > (squares.length - (width-1))) {
                resultDisplay.textContent = 'Game Over'
                clearInterval(invaderId)
            }
        }

        // Decide a win
        if (alienInvadersTakenDown.length === alienInvaders.length) {
            resultDisplay.textContent = 'You Win'
            clearInterval(invaderId)
        }
    }

    invaderId = setInterval(moveInvaders, 500)


    // Shoot at aliens
    function shoot(e) {
        let laserId
        let currentLaserIndex = currentShooterIndex
        // Move the laser from the shooter to the alien Invader
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')

            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('invader')
                squares[currentLaserIndex].classList.add('boom')

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
                clearInterval(laserId)

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)
                alienInvadersTakenDown.push(alienTakenDown)
                result++
                resultDisplay.textContent = result
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }

        // document.addEventListener('keyup', e => {
        //     if (e.keyCode === 32) {
        //         laserId = setInterval(moveLaser, 100)
        //     }
        // })

        switch(e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
                break
        }
    }

    document.addEventListener('keyup', shoot)
    
})