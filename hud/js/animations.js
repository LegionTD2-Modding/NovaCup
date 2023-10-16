// Animations using velocity-react.js
// ==================================================================================

function GetAnimationPreset1(show, deltaX, deltaY) {
    if (show) {
        return {
            duration: 10,
            animation: {
                translateX: '0px',
                translateY: '0px',
                opacity: 1
            },
            display: ''
        };
    } else {
        return {
            duration: 200,
            animation: {
                translateX: deltaX + 'px',
                translateY: deltaY + 'px',
                opacity: 0
            },
            display: 'none'
        };
    }
}

function GetAnimationPreset2(show, deltaX, deltaY) {
    if (show) {
        return {
            duration: 60,
            animation: {
                translateX: '0px',
                translateY: '0px',
                opacity: 1
            },
            display: ''
        };
    } else {
        return {
            duration: 200,
            animation: {
                translateX: deltaX + 'px',
                translateY: deltaY + 'px',
                opacity: 0
            },
            display: 'none'
        };
    }
}

function GetAnimationPreset3(show, deltaX, deltaY) {
    if (show) {
        return {
            duration: 200,
            animation: {
                translateX: '0px',
                translateY: '0px',
                opacity: 1
            },
            display: ''
        };
    } else {
        return {
            duration: 200,
            animation: {
                translateX: deltaX + 'px',
                translateY: deltaY + 'px',
                opacity: 0
            },
            display: 'none'
        };
    }
}

function GetAnimationPreset5(show) {
    if (show) {
        return {
            duration: 60,
            animation: {
                translateX: '0px',
                translateY: '0px',
                opacity: 1,
            },
            display: '',
        };
    } else {
        return {
            duration: 200,
            animation: {
                translateX: 0 + 'px',
                translateY: -60 + 'px',
                opacity: 0,
            },
            display: 'none',
        };
    }
}

// For text callouts
function GetAnimationPreset6(show) {
    if (show == 0) {
        return {
            duration: 0,
            animation: {
                //scale: 1.33,
                translateX: 0 + 'px',
                translateY: 15 + 'px',
                opacity: 1,
            },
            display: '',
        };
    } else if (show == 1) {
        return {
            duration: 60,
            animation: {
                //scale: 1,
                translateX: 0 + 'px',
                translateY: 0 + 'px',
                opacity: 1,
            },
            display: '',
        };
    } else {
        return {
            duration: 60,
            animation: {
                scale: 1,
                translateX: 0 + 'px',
                translateY: 30 + 'px',
                opacity: 0,
            },
            display: 'none',
        };
    }
}

function GetAnimationFade(show, fadeDurationIn, fadeDurationOut) {
    if (show) {
        return {
            duration: fadeDurationIn,
            animation: {
                translateX: '0px',
                translateY: '0px',
                opacity: 1
            },
            display: ''
        };
    } else {
        return {
            duration: fadeDurationOut,
            animation: {
                translateX: '0px',
                translateY: '0px',
                opacity: 0
            },
            display: 'none'
        };
    }
}

function GetFullScreenHorizontalAnimation(show, deltaX) {
    if (show) {
        return {
            duration: 250,
            animation: {
                translateX: '0px',
                translateY: '0px',
                opacity: 1
            },
            display: ''
        };
    } else {
        return {
            duration: 250,
            animation: {
                translateX: deltaX,
                opacity: 0
            },
            display: 'none'
        };
    }
}