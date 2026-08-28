/* ============================================
   FOREST FOOD CHAIN VIDEO - JAVASCRIPT LOGIC
   ============================================ */

let currentScene = 1;
let isAutoPlaying = false;
let autoPlayTimer = null;
let sceneStartTime = 0;
const SCENE_DURATION = 6000; // 6 seconds per scene

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Forest Food Chain Video Application Loaded');
    updateSceneDisplay();
    initializeSounds();
});

/**
 * Display the current scene and update controls
 */
function updateSceneDisplay() {
    // Hide all scenes
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => {
        scene.classList.remove('active');
    });

    // Show current scene
    const activeScene = document.getElementById(`scene${currentScene}`);
    if (activeScene) {
        activeScene.classList.add('active');
    }

    // Update indicators
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index + 1 === currentScene) {
            dot.classList.add('active');
        }
    });

    // Reset animation on scene change
    sceneStartTime = Date.now();

    // Trigger scene-specific animations
    triggerSceneAnimation(currentScene);
}

/**
 * Trigger animations specific to each scene
 */
function triggerSceneAnimation(sceneNumber) {
    switch(sceneNumber) {
        case 1:
            animateForestScene();
            break;
        case 2:
            animateSilkwormScene();
            break;
        case 3:
            animateFoodChainScene();
            break;
        case 4:
            animateDiagramScene();
            break;
    }
}

/**
 * Animate Forest Scene
 */
function animateForestScene() {
    console.log('Animating Forest Scene');
    playSound('forest-ambient');

    // Add subtle movement to trees
    const trees = document.querySelectorAll('.tree');
    trees.forEach((tree, index) => {
        tree.style.animation = 'none';
        setTimeout(() => {
            tree.style.animation = `treeWave 3s ease-in-out ${index * 0.2}s infinite`;
        }, 10);
    });

    // Animate flowers
    const flowers = document.querySelectorAll('.flower');
    flowers.forEach(flower => {
        flower.style.animation = 'flowerSway 2s ease-in-out infinite';
    });
}

/**
 * Animate Silkworm Scene
 */
function animateSilkwormScene() {
    console.log('Animating Silkworm Scene');
    playSound('forest-ambient');
    playSound('soft-eating-sound');

    const silkworm = document.getElementById('silkworm');
    const targetLeaf = document.getElementById('targetLeaf');

    if (silkworm && targetLeaf) {
        // Silkworm crawls towards the leaf
        silkworm.style.animation = 'crawlToLeaf 4s ease-in-out infinite';
    }
}

/**
 * Animate Food Chain Progression Scene
 */
function animateFoodChainScene() {
    console.log('Animating Food Chain Scene');
    playSound('forest-ambient');

    // Chain of eating animations
    setTimeout(() => {
        playSound('bird-chirp');
    }, 500);

    setTimeout(() => {
        playSound('hawk-screech');
    }, 2000);

    // Add glow effects
    const scene3Silkworm = document.getElementById('scene3-silkworm');
    const scene3Sparrow = document.getElementById('scene3-sparrow');
    const scene3Hawk = document.getElementById('scene3-hawk');

    if (scene3Silkworm) {
        scene3Silkworm.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))';
    }
    if (scene3Sparrow) {
        scene3Sparrow.style.filter = 'drop-shadow(0 0 10px rgba(210, 180, 140, 0.6))';
    }
    if (scene3Hawk) {
        scene3Hawk.style.filter = 'drop-shadow(0 0 10px rgba(139, 69, 19, 0.6))';
    }
}

/**
 * Animate Diagram Scene
 */
function animateDiagramScene() {
    console.log('Animating Diagram Scene');
    playSound('forest-ambient');

    const organisms = document.querySelectorAll('.organism');
    organisms.forEach((organism, index) => {
        organism.style.animation = `none`;
        setTimeout(() => {
            organism.style.animation = `pulse 2s ease-in-out ${index * 0.3}s infinite`;
        }, 10);
    });
}

/**
 * Navigate to next scene
 */
function nextScene() {
    if (currentScene < 4) {
        currentScene++;
        updateSceneDisplay();
        if (isAutoPlaying) {
            // Reset auto-play timer
            sceneStartTime = Date.now();
        }
    }
}

/**
 * Navigate to previous scene
 */
function previousScene() {
    if (currentScene > 1) {
        currentScene--;
        updateSceneDisplay();
        if (isAutoPlaying) {
            sceneStartTime = Date.now();
        }
    }
}

/**
 * Go to specific scene
 */
function goToScene(sceneNumber) {
    currentScene = sceneNumber;
    updateSceneDisplay();
    if (isAutoPlaying) {
        sceneStartTime = Date.now();
    }
}

/**
 * Toggle auto-play mode
 */
function toggleAutoPlay() {
    const playBtn = document.getElementById('playBtn');
    
    if (isAutoPlaying) {
        // Stop auto-play
        isAutoPlaying = false;
        playBtn.textContent = '▶ تشغيل';
        playBtn.classList.remove('playing');
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
        }
    } else {
        // Start auto-play
        isAutoPlaying = true;
        playBtn.textContent = '⏸ إيقاف';
        playBtn.classList.add('playing');
        sceneStartTime = Date.now();
        startAutoPlay();
    }
}

/**
 * Auto-play logic
 */
function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
        const elapsed = Date.now() - sceneStartTime;
        const progress = (elapsed % SCENE_DURATION) / SCENE_DURATION;

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = (progress * 100) + '%';
        }

        // Move to next scene when timer is done
        if (elapsed >= SCENE_DURATION) {
            if (currentScene < 4) {
                nextScene();
            } else {
                // Loop back to scene 1
                currentScene = 1;
                updateSceneDisplay();
            }
            sceneStartTime = Date.now();
        }
    }, 50);
}

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        nextScene();
    } else if (e.key === 'ArrowLeft') {
        previousScene();
    } else if (e.key === ' ') {
        toggleAutoPlay();
        e.preventDefault();
    }
});

/**
 * Add CSS animations dynamically
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes treeWave {
        0%, 100% { transform: scaleX(1); }
        50% { transform: scaleX(1.02); }
    }

    @keyframes flowerSway {
        0%, 100% { transform: rotate(-1deg); }
        50% { transform: rotate(1deg); }
    }

    @keyframes crawlToLeaf {
        0%, 100% { 
            left: 35%; 
            top: 220px;
        }
        50% { 
            left: 42%; 
            top: 200px;
        }
    }

    @keyframes pulse {
        0%, 100% { 
            opacity: 1;
            transform: scale(1);
        }
        50% { 
            opacity: 0.8;
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

/**
 * Add touch support for mobile navigation
 */
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.scene-container').addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.querySelector('.scene-container').addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0) {
            // Swiped left
            nextScene();
        } else {
            // Swiped right
            previousScene();
        }
    }
}

console.log('Forest Food Chain Video - Main Script Loaded');
