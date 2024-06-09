document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('jwPlayer');
    const sourceSelect = document.getElementById('sourceSelector');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieId = urlParams.get('movie');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Use the movieId to dynamically set the JW Player video source
    const { videoSources, movieDetails, availableQualities, sourceNames } = getVideoSourceAndDetailsForMovie(movieId);

    // Set the highest quality as the default quality
    const defaultQuality = Math.max(...availableQualities);

    // Check if it's iOS and set playsinline attribute
    if (isIOS) {
        video.setAttribute('playsinline', '');
        video.setAttribute('controls', '');
    }

    // Initialize JW Player
    const playerInstance = jwplayer("jwPlayer").setup({
        playlist: [{
            sources: [
                {
                    file: videoSources[0], // Default source, should be a DASH MPD file
                    type: 'dash'
                },
                {
                    file: videoSources[1], // Additional source, should be an HLS M3U8 file
                    type: 'hls'
                }
            ]
        }],
        width: "100%",
        aspectratio: "16:9",
        autostart: true,
        controls: true,
        mute: false,
        skin: {
            controlbar: {
                background: "rgba(255, 255, 255, 0.0)", // Light grey background
                icons: "#e3ca0b", // Dark grey icons
                iconsActive: "#fcba03", // Golden yellow for active icons
                text: "#fff" // Dark grey text
            },
            menus: {
                background: "#000000", // Bright blue background
                text: "#ffffff", // White text
                textActive: "#e3ca0b" // Pink text for active state
            },
            timeslider: {
                progress: "#e3ca0b", // Bright green progress
                rail: "#ff66b2" // Light grey rail
            },
            tooltips: {
                background: "#e3ca0b", // Orange tooltip background
                text: "#fff" // Dark grey tooltip text
            }
        },
        qualityLabel: {
            mobile: true,
            label: '1080p', // or '720p' (default quality)
            item: availableQualities
        }
    });

    // Update movie information on the player page
    updateMovieInformation(movieDetails);

    // Add the "Live" text and red blinking dot
    addLiveIndicator();

    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Check if source selection dropdown is available
    if (sourceSelect) {
        // Update player source when chosen
        sourceSelect.addEventListener('change', () => {
            const selectedSourceIndex = parseInt(sourceSelect.value, 10);
            updatePlayerSource(playerInstance, videoSources[selectedSourceIndex]);
        });

        // Populate source selector dropdown with source names
        for (let i = 0; i < sourceNames.length; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = sourceNames[i];
            sourceSelect.appendChild(option);
        }
    }    
});

function updateMovieInformation(details) {
    // Update movie details on the player page
    document.getElementById('movieTitle').innerText = details.title;
    document.getElementById('pageTitle').innerText = details.title + ' - BBTV';
    document.getElementById('rating').innerText = `Rating: ${details.rating}`;
    document.getElementById('genre').innerText = `Genre: ${details.genre}`;
    document.getElementById('duration').innerText = `Duration: ${details.duration}`;
    document.getElementById('movieDescription').innerText = details.description;
}

function addLiveIndicator() {
    const playerHeader = document.querySelector('.player-header');

    // Create the "Live:" text
    const liveText = document.createElement('span');
    liveText.innerText = 'Live: ';
    playerHeader.appendChild(liveText);

    // Create the red blinking dot
    const redDot = document.createElement('span');
    redDot.classList.add('blinking');
    redDot.innerHTML = '<svg height="10" width="10"><circle cx="5" cy="5" r="5" fill="red"></circle></svg>';
    playerHeader.appendChild(redDot);
}

function getVideoSourceAndDetailsForMovie(movieId) {
    switch (movieId) {
        case 'movie1':
            return {
                videoSources: [
                    'https://58a48a11e736a.streamlock.net/uploads/jio_1437252/30e5981b030f79f1b7cc2c89cdcfe7ed/master.m3u8',
                    'https://aba5sdmaaaaaaaamkycwliah6buj4.otte.live.cf.ww.aiv-cdn.net/pdx-nitro/live/clients/dash/enc/tgcrfjcgia/out/v1/7296f026409c4e9ba8844a238628f9ad/cenc.mpd?|drmScheme=clearkey&drmLicense=d1badeadb11f16bbd0ad7d47914d939e:bd52d185d3537c4c1759db6d66f90f31',
                    'http://177.53.153.20:8001/play/a01v/index.m3u8'
                ],
                sourceNames: ['HLS Stream 1', 'DASH Stream 1', 'HLS Stream 2'],
                movieDetails: {
                    title: 'English TV',
                    rating: '7.6',
                    genre: 'Entertainment',
                    duration: 'Live',
                    description: 'Select Channels from Dropdown List'
                },
                availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
            };
        default:
            return {
                videoSources: [],
                sourceNames: [],
                movieDetails: {
                    title: 'Unknown',
                    rating: '',
                    genre: '',
                    duration: '',
                    description: ''
                },
                availableQualities: []
            };
    }
}

function updatePlayerSource(playerInstance, source) {
    // Pause the player
    playerInstance.pause();

    // Load the new source
    playerInstance.load({
        file: source
    });

    // Play the player
    playerInstance.play();
}
