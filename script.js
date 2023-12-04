// script.js

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoPlayer');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieId = urlParams.get('movie');
    
    // Use the movieId to dynamically set the HLS stream URL and get movie details
    const { hlsStreamURL, movieDetails } = getHLSStreamURLAndDetailsForMovie(movieId);

    const defaultOptions = {};

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsStreamURL);

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            const availableQualities = hls.levels.map((l) => l.height);

            // Add new qualities to option
            defaultOptions.quality = {
                default: availableQualities[0],
                options: availableQualities,
                // this ensures Plyr to use Hls to update quality level
                forced: true,        
                onChange: (e) => updateQuality(e),
            }

            // Initialize here
            const player = new Plyr(video, defaultOptions);

            // Update movie information on the player page
            updateMovieInformation(movieDetails);

            // Add the "Live" text and red blinking dot
            addLiveIndicator();
        });
        hls.attachMedia(video);
        window.hls = hls;
    } else {
        // default options with no quality update in case Hls is not supported
        const player = new Plyr(video, defaultOptions);

        // Update movie information on the player page
        updateMovieInformation(movieDetails);

        // Add the "Live" text and red blinking dot
        addLiveIndicator();
    }

    function updateQuality(newQuality) {
        window.hls.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
                console.log("Found quality match with " + newQuality);
                window.hls.currentLevel = levelIndex;
            }
        });
    }

    function updateMovieInformation(details) {
        // Update movie details on the player page
        document.getElementById('movieTitle').innerText = details.title;
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
        redDot.innerHTML = '<svg height="10" width="10"><circle cx="5" cy="5" r="5" fill="white"></circle></svg>';
        playerHeader.appendChild(redDot);
    }
});

function getHLSStreamURLAndDetailsForMovie(movieId) {
    switch (movieId) {
        case 'movie1':
            return {
                hlsStreamURL: 'https://prod-ent-live-gm.jiocinema.com/hls/live/2105488/hd_akamai_iosmob_avc_24x7_bbhindi_day01/master.m3u8',
                movieDetails: {
                    title: 'Bigg Boss Hindi Live 24x7',
                    rating: '4.5',
                    genre: 'Reality TV',
                    duration: '24/7',
                    description: 'Description for Bigg Boss Hindi Live 24x7.'
                }
            };
        case 'movie2':
            return {
                hlsStreamURL: 'https://prod-ent-live-gm.jiocinema.com/bpk-tv/Colors_HD_voot_MOB/Fallback/index.m3u8',
                movieDetails: {
                    title: 'ColorsTV Hindi HD',
                    rating: '4.2',
                    genre: 'Entertainment',
                    duration: '2h 30min',
                    description: 'Description for ColorsTV Hindi HD.'
                }
            };
        case 'movie3':
            return {
                hlsStreamURL: 'https://prod-ent-live-gm.jiocinema.com/bpk-tv/Colors_Kannada_HD_voot_MOB/Fallback/index.m3u8',
                movieDetails: {
                    title: 'ColorsTV Kannada HD',
                    rating: '4.0',
                    genre: 'Entertainment',
                    duration: '2h 15min',
                    description: 'Description for ColorsTV Kannada HD.'
                }
            };
        case 'movie4':
            return {
                hlsStreamURL: 'https://prod-ent-live-gm.jiocinema.com/hls/live/2101563/hd_akamai_iosmob_avc_24x7_bbkannada_day01/master.m3u8',
                movieDetails: {
                    title: 'Bigg Boss Kannada Live 24x7',
                    rating: '4.7',
                    genre: 'Reality TV',
                    duration: '24/7',
                    description: 'Description for Bigg Boss Kannada Live 24x7.'
                }
            };
        case 'movie5':
            return {
                hlsStreamURL: 'https://prod-ent-live-gm.jiocinema.com/hls/live/3846098/hd_akamai_iosmob_avc_24x7_temptation_day01/master.m3u8',
                movieDetails: {
                    title: 'Temptation Island Live',
                    rating: '4.7',
                    genre: 'Reality TV',
                    duration: '24/7',
                    description: 'Temptation Island Live.'
                }
            };
        default:
            return {
                hlsStreamURL: 'https://prod-ent-live-gm.jiocinema.com/hls/live/2105488/hd_akamai_iosmob_avc_24x7_bbhindi_day01/master.m3u8',
                movieDetails: {
                    title: 'Bigg Boss Hindi Live 24x7',
                    rating: '4.5',
                    genre: 'Reality TV',
                    duration: '24/7',
                    description: 'Description for Bigg Boss Hindi Live 24x7.'
                }
            };
    }
}
