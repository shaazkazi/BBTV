// script.js

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoPlayer');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieId = urlParams.get('movie');
    
    // Use the movieId to dynamically set the HLS stream URL
    const hlsStreamURL = getHLSStreamURLForMovie(movieId);

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
    });
    hls.attachMedia(video);
    window.hls = hls;
  } else {
    // default options with no quality update in case Hls is not supported
    const player = new Plyr(video, defaultOptions);
  }

  function updateQuality(newQuality) {
    window.hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        console.log("Found quality match with " + newQuality);
        window.hls.currentLevel = levelIndex;
      }
    });
  }
});

function getHLSStreamURLForMovie(movieId) {
    switch (movieId) {
        case 'movie1':
            return 'https://prod-ent-live-gm.jiocinema.com/hls/live/2105488/hd_akamai_iosmob_avc_24x7_bbhindi_day01/master.m3u8';
        case 'movie2':
            return 'https://prod-ent-live-gm.jiocinema.com/bpk-tv/Colors_HD_voot_MOB/Fallback/index.m3u8';
        case 'movie3':
            return 'https://prod-ent-live-gm.jiocinema.com/bpk-tv/Colors_Kannada_HD_voot_MOB/Fallback/index.m3u8';
        default:
            return 'https://example.com/default.m3u8';
    }
}
