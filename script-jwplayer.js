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
    redDot.innerHTML = '<svg height="10" width="10"><circle cx="5" cy="5" r="5" fill="white"></circle></svg>';
    playerHeader.appendChild(redDot);
}

function getVideoSourceAndDetailsForMovie(movieId) {
    switch (movieId) {
        case 'movie1':
            return {
                videoSources: [
                    'https://58a48a11e736a.streamlock.net/uploads/jio_1437252/30e5981b030f79f1b7cc2c89cdcfe7ed/master.m3u8',
                    'https://str12.vtube.network/hls/,x5s4v5chpbyki6cgane4rppvh3y2jbrvu36j7ij7mtv75v6haubiiyt7rpeq,.urlset/master.m3u8',
                    'https://prod-ent-live-gm.jiocinema.com/hls/live/2105488/hd_akamai_iosmob_avc_new_24x7_bbhindi_day01/master.m3u8',
                    'https://prod-ent-live-gm.jiocinema.com/hls/live/2105484/hd_akamai_iosmob_avc_new_cam01_bbhindi_day01/master.m3u8',
                    'https://prod-ent-live-gm.jiocinema.com/hls/live/2105437/hd_akamai_iosmob_avc_new_cam02_bbhindi_day01/master.m3u8',
                    'https://prod-ent-live-gm.jiocinema.com/hls/live/2105488/hd_akamai_iosmob_avc_new_24x7_bbhindi_day01/master.m3u8',
                ],
                sourceNames: ['BB Hindi Finale', 'BB Kannada Finale', 'Main Cam', 'Garden Cam', 'Washroom Cam', 'Backup'],
                movieDetails: {
                    title: 'Bigg Boss Hindi Live 24x7',
                    rating: '3.7',
                    genre: 'Reality TV',
                    duration: '24/7',
                    description: 'Isolated from the outside world, the contestants live together in a house under the live cameras that monitor their every move. They perform various tasks and avoid eviction to be declared a winner.'
                },
                availableQualities: [144, 240, 360, 480, 720, 1080],
            };
        // Handle other cases similarly with the necessary video sources and details
        case 'movie2':
            return {
                videoSources: [
                    'https://mymhdtvworld.com/vt/stream.m3u8?id=Colors_HD',
                    'https://fifaxbd.fun/SKN2/play.php?id=144&e=.m3u8',
                    'https://fifaxbd.fun/SKN2/play.php?id=1368&e=.m3u8',
                    'https://prod-ent-live-gm.jiocinema.com/bpk-tv/Colors_HD_voot_MOB/Fallback/index.m3u8',
                    'https://catchup.yuppcdn.net:443/amazonv2/36/preview/colorsbanglahd/master/chunklist.m3u8',
                     // Replace with the actual second source
                ],
                sourceNames: ['Colors HD', 'Colors HD Backup', 'Colors SD', 'Backup', 'Colors Bangla HD'],
                movieDetails: {
                    title: 'ColorsTV Hindi HD',
                    rating: '3.7',
                    genre: 'Entertainment',
                    duration: '2h 30min',
                    description: 'Colors TV is an Indian general entertainment pay television channel owned by Viacom18. It was launched on 21 July 2008.[1] Its programming consists of family dramas, comedies, fantasy shows, youth-oriented reality shows, shows on crime, and television films.[2],\n\nWatch Bigg Boss on ColorsTV: Monday - Friday 9:30 PM and Saturday - Sunday at 9:00 PM IST.'
                },
                availableQualities: [144, 240, 360, 480, 720, 1080],
            };
        case 'movie3':
            return {
                videoSources: [
                    'https://livevoot.co.in/project/master.m3u8?id=Colors_Kannada_HD_voot_MOB',
                    'https://fifaxbd.fun/SKN2/play.php?id=757&e=.m3u8', // Replace with the actual second source
                    'https://fifaxbd.fun/SKN2/play.php?id=1370&e=.m3u8',
                    'https://livevoot.co.in/voot/master.m3u8?id=Colors_Kannada_HD_voot_MOB',
                    
                ],
                sourceNames: ['Colors Kannada HD', 'Colors Kannada HD Backup', 'Colors Kannada SD', 'Backup'],
                movieDetails: {
                    title: 'ColorsTV Kannada HD',
                    rating: '6.3',
                    genre: 'Entertainment',
                    duration: '2h 15min',
                    description: 'Colors Kannada (previously known as ETV Kannada), is an Indian general entertainment channel, owned by Viacom18 that primarily broadcasts Kannada language entertainment shows.',
                },
                availableQualities: [144, 240, 360, 480, 720, 1080],
            };
            case 'movie4':
                return {
                    videoSources: [
                        'https://prod-ent-live-gm.jiocinema.com/hls/live/2101563/hd_akamai_iosmob_avc_24x7_bbkannada_days001/master.m3u8',
                        'https://str14.vtube.network/hls/,x5s42y6qozyki6cganp4rmven2nzdsfa6jbwgqddlecgd76ghlxpi2np2dxq,.urlset/master.m3u8',
                        'https://str13.vtube.network/hls/,x5s4yvcbozyki6cganl4rpx4nvi6ga7fzprneefu44ikr3f3infgzhpy52hq,.urlset/master.m3u8',
                        'https://str12.vtube.network/hls/,x5s4zlboozyki6cganlmrop4gufijpamrqnpkxtjcc2h3ps46tb42xs4vfcq,.urlset/master.m3u8',
                        'https://prod-ent-live-gm.jiocinema.com/hls/live/2101563/hd_akamai_iosmob_avc_24x7_bbkannada_day01/master.m3u8',
                    ],
                sourceNames: ['Main Cam', 'Episode 10 Jan', 'Episode 02 Jan', 'Episode 01 Jan', 'Backup'],
                movieDetails: {
                    title: 'Bigg Boss Kannada Live 24x7',
                    rating: '6.3',
                    genre: 'Reality TV',
                    duration: '24/7',
                    description: 'Bigg Boss Kannada is a reality show based on the Hindi show Bigg Boss which too was based on the original Dutch Big Brother. A number of contestants (known as "housemates") live in a purpose-built house and are isolated from the rest of the world.'
                },
                availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
            };
            case 'movie5':
                return {
                    videoSources: [
                        'https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeeanmolcinema/default/index.m3u8',
                        'https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Zeecinemahd/default/zeecinemahd-audio_208482_und=208000-video=2137600.m3u8',
                        'https://weyyak-live.akamaized.net/weyyak_zee_aflam/index.m3u8',
                        'https://weyyak-live.akamaized.net/weyyak_zee_alwan/index.m3u8',
                        'https://prod-ent-live-gm.jiocinema.com/hls/live/2106329/hd_akamai_iosmob_avc_temptationisland_day001/master.m3u8',
                    ],
                    sourceNames: ['Zee Anmol Cinema', 'Zee Cinema HD', 'Zee Aflam', 'Zee Alwan', 'Backup'],
                movieDetails: {
                        title: 'Temptation Island Live',
                        rating: '7.6',
                        genre: 'Reality TV',
                        duration: '24/7',
                        description: 'Couples test the strength of their relationship by surrounding themselves with attractive strangers on a tropical island.'
                    },
                    availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                };
                case 'movie6':
                    return {
                        videoSources: [
                            'https://livevoot.co.in/voot/master.m3u8?id=MTV_HD_Plus_voot_MOB',
                            'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5ca672f515a62078d2ec0ad2/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1&advertisingId=channel&embedPartner=rokuChannel&appName=rokuchannel&is_lat=1&bmodel=bm1&content=channel&platform=web&tags=ROKU_CONTENT_TAGS&coppa=false&content_type=livefeed&rdid=channel&genre=ROKU_ADS_CONTENT_GENRE&content_rating=ROKU_ADS_CONTENT_RATING&studio_id=viacom&channel_id=channel%20',
                            'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5cf96d351652631e36d4331f/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1&advertisingId=channel&embedPartner=rokuChannel&appName=rokuchannel&is_lat=1&bmodel=bm1&content=channel&platform=web&tags=ROKU_CONTENT_TAGS&coppa=false&content_type=livefeed&rdid=channel&genre=ROKU_ADS_CONTENT_GENRE&content_rating=ROKU_ADS_CONTENT_RATING&studio_id=viacom&channel_id=channel%20',
                            'https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5d14fc31252d35decbc4080b/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1&advertisingId=channel&embedPartner=rokuChannel&appName=rokuchannel&is_lat=1&bmodel=bm1&content=channel&platform=web&tags=ROKU_CONTENT_TAGS&coppa=false&content_type=livefeed&rdid=channel&genre=ROKU_ADS_CONTENT_GENRE&content_rating=ROKU_ADS_CONTENT_RATING&studio_id=viacom&channel_id=channel%20',
                            'https://250weu.bozztv.com/ssh101/ssh101/kpoptv/playlist.m3u8',
                            'https://tv.streaming-chile.com:1936/mundodelamusicatv/mundodelamusicatv/playlist.m3u8?PlaylistM3UCL',
                        ],
                        sourceNames: ['MTV India HD', 'MTV Pluto', 'MTV Latina', 'MTV Yo!', 'K-pop TV', 'MundoDelaMusicaTV'],
                movieDetails: {
                            title: 'MTV HD',
                            rating: '7.6',
                            genre: 'Music Videos',
                            duration: '24/7',
                            description: 'Live music channel'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
                
                case 'movie7':
                    return {
                        videoSources: [
                            'https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01412-xiaomiasia-yrfmusic-xiaomi/playlist.m3u8',
                            'https://d2q8p4pe5spbak.cloudfront.net/bpk-tv/9XM/9XM.isml/index.m3u8',
                            'https://mcncdndigital.com/balleballetv/index.m3u8',
                            'http://live.agmediachandigarh.com/booglebollywood/774e3ea9f3fa9bcdac47f445b83b6653.sdp/index.m3u8',
                            'https://player.mslivestream.net/mslive/e10bb900976df9177b9a080314f26f86.sdp/index.m3u8',
                        ],
                        sourceNames: ['YRF Music', '9XM', 'Balle Balle', 'Boogle Bollywood', 'Moon Music Tamil'],
                movieDetails: {
                            title: 'YRF Music',
                            rating: '7.6',
                            genre: 'Music Videos',
                            duration: '24/7',
                            description: 'Live music channel'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
                
                case 'movie8':
                    return {
                        videoSources: [
                            'https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeekannada/default/index.m3u8',
                            'https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeekannada/default/index.m3u8',
                            'https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeekannada/default/index.m3u8',
                            'https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeekannada/default/index.m3u8',
                        ],
                        sourceNames: ['Main Cam', 'Backup', 'Backup', 'Backup'],
                movieDetails: {
                            title: 'Zee Kannada',
                            rating: '7.6',
                            genre: 'Entertainment',
                            duration: '24/7',
                            description: 'Live Zee Kannada'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
                
                case 'movie9':
                    return {
                        videoSources: [
                            'https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/bollywoodhungama_live_https/master.m3u8',
                            'https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/bollywoodhungama_live_https/master.m3u8',
                            'https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/bollywoodhungama_live_https/master.m3u8',
                            'https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/bollywoodhungama_live_https/master.m3u8',
                        ],
                        sourceNames: ['Main Cam', 'Backup', 'Backup', 'Backup'],
                movieDetails: {
                            title: 'Bollywood Hungama',
                            rating: '7.6',
                            genre: 'Music Videos',
                            duration: '24/7',
                            description: 'Live Music Videos'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
                
                case 'movie10':
                    return {
                        videoSources: [
                            'https://tvs3.aynaott.com/BOLEntertainment/tracks-v1a1/mono.m3u8?hdnts=st=1702107081~exp=1702150281~acl=/*~data=37.211.71.106-WEB~hmac=a737615e80f097248864949dac89a4ba58f0c06a558b27cefe501091d7f65d76',
                            'https://tvs3.aynaott.com/BOLEntertainment/tracks-v1a1/mono.m3u8?hdnts=st=1702107081~exp=1702150281~acl=/*~data=37.211.71.106-WEB~hmac=a737615e80f097248864949dac89a4ba58f0c06a558b27cefe501091d7f65d76',
                            'https://tvs3.aynaott.com/BOLEntertainment/tracks-v1a1/mono.m3u8?hdnts=st=1702107081~exp=1702150281~acl=/*~data=37.211.71.106-WEB~hmac=a737615e80f097248864949dac89a4ba58f0c06a558b27cefe501091d7f65d76',
                            'https://tvs3.aynaott.com/BOLEntertainment/tracks-v1a1/mono.m3u8?hdnts=st=1702107081~exp=1702150281~acl=/*~data=37.211.71.106-WEB~hmac=a737615e80f097248864949dac89a4ba58f0c06a558b27cefe501091d7f65d76',
                        ],
                        sourceNames: ['Main Cam', 'Backup', 'Backup', 'Backup'],
                movieDetails: {
                            title: 'Bol Entertainment',
                            rating: '7.6',
                            genre: 'Pakistani TV',
                            duration: '24/7',
                            description: 'Live Pakistani TV Shows'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
                
                case 'movie11':
                    return {
                        videoSources: [
                            'https://vo-live.cdb.cdn.orange.com/Content/Channel/EmiratesChannel/HLS/index.m3u8',
                            'https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiSportsChannel1/HLS/index.m3u8',
                            'https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiSportsChannel2/HLS/index.m3u8',
                            'https://vdo.panelchs.com:3763/stream/play.m3u8',
                        ],
                        sourceNames: ['Emirates TV', 'Abu Dhabi Sports', 'Abu Dhabi Sports 2 ', 'Backup'],
                movieDetails: {
                            title: 'More TV',
                            rating: '7.6',
                            genre: 'Reality TV',
                            duration: '24/7',
                            description: 'More TV'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
                    case 'movie12':
                    return {
                        videoSources: [
                            'https://str13.vtube.network/hls/,x5s47gkwo5yki6cganc4rmxtmrex2kzkixzroxws4lmsl3b43skfu7qbvocq,.urlset/master.m3u8',
                            'https://str13.vtube.network/hls/,x5s47accozyki6cganl4rjhup54o7ru5df65skcv5lkklzopbfh5uphu5d6a,.urlset/master.m3u8',
                            'https://str12.vtube.network/hls/,x5s42tbnozyki6cganlmrifdo7sizzeiaq7ih7agvqramzxhal6h5y6zvnjq,.urlset/master.m3u8',
                            'https://str1.vtube.network/hls/,x5s4uqquozyki6cgank4rjpuo5mnngdrxeqcoym6i3qdn5fs33x2bqg4ks5a,.urlset/master.m3u8',
                        ],
                        sourceNames: ['17th JANUARY 2024', '2ND JANUARY 2024', '1ST JANUARY 2024', '31ST DECEMBER 2023'],
                movieDetails: {
                            title: 'Bigg Boss Episodes',
                            rating: '7.6',
                            genre: 'Reality TV',
                            duration: '1:11:23',
                            description: 'Bigg Boss Episodes watch online, select from dropdown for previous episodes'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
               case 'movie13':
                    return {
                        videoSources: [
                            'https://i.mjh.nz/SamsungTVPlus/INBD21000016Y.m3u8',
                            'https://58a48a11e736a.streamlock.net/uploads/jio_1395297/c18339f6d1578c44242cd60e8d57465b/master.m3u8',
                            'https://s2.putgate.org/cdn/H4sIAAAAAAAAAwXB207EIBAA0F.aGexFE1.MO0EiNYVSurwV2GYjtdFFH_TrPafpMkDfbuIubi2IFeIGkFtqeurbLncPkdRViytqaOrlMM9almYkVqsw2nFg54dqJWOcVBiW_BV3daTC6DjXSJWc4Fv6CL..fL.kgmFGZgf3dlx4snL_SdMcHKB5W7K8.P1ppHyKJ7xZYGVlmMzf_L6WQMZXOhcs2isYj2HIRYMWpqZjFq_i0yUsj_9qHpaPzQAAAA--/list.m3u8',
                            'https://vdo.panelchs.com:3763/stream/play.m3u8',
                        ],
                        sourceNames: ['Server 1', 'Server 2', 'Kantara', 'Backup'],
                movieDetails: {
                            title: 'Bigg Boss Episodes',
                            rating: '7.6',
                            genre: 'Reality TV',
                            duration: '1:11:23',
                            description: 'Bigg Boss Episodes watch online, select from dropdown for previous episodes'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
              case 'movie14':
                    return {
                        videoSources: [
                            'https://af.ayas.ir/hls2/ssc1.m3u8',
                            'https://bds.jagobd.com:447/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/tracks-v1a1/mono.m3u8',
                            'https://103.lfjustfor.xyz:8088/stream/lizata11/playlist.m3u8?id=46473&pk=31b9a5217b3d811750301f77dadc1e84734f2f8fe6cf390b99d1fd40539094c7',
                            'https://livevoot.co.in/voot/master.m3u8?id=Sports18_1_HD_voot_MOB',
                            'https://edge3-moblive.yuppcdn.net/trans1sd/smil:starsports1.smil/chunklist_w832521686_b596000.m3u8',
                            'https://mavtv-mavtvglobal-1-in.samsung.wurl.tv/playlist.m3u8',
                            'https://glxlmn026c.singularcdn.net.br/playout_04/playlist.m3u8',
                            'https://glxlmn026c.singularcdn.net.br/playout_05/playlist.m3u8',
                            'https://d2p372oxiwmcn1.cloudfront.net/hls/main.m3u8',
                            'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
                        ],
                        sourceNames: ['Asia Cup', 'GreenTV', 'Big Bash Live', 'Sports18', 'Star Sports', 'Mav TV', 'TNT Sports', 'TNT Sports 2', 'Impact Wrestling', 'Redbull Ger'],
                movieDetails: {
                            title: 'Sports',
                            rating: '7.6',
                            genre: 'Sports',
                            duration: 'Live',
                            description: 'Watch Cricket Live'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie15':
                    return {
                        videoSources: [
                            'https://d75dqofg5kmfk.cloudfront.net/bpk-tv/Zeetvhd/default/index.m3u8',
                            'https://ed-b002.edgking.me/plyvivo/f06o3ojo2ado3e5ukaro/chunklist.m3u8',
                            'https://bds.jagobd.com:447/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/tracks-v1a1/mono.m3u8',
                            'https://103.lfjustfor.xyz:8088/stream/lizata1/playlist.m3u8?id=43662&pk=e944f4769098ad32bacd383226b8ff3e9a685c9d77dd456d8f362e2a162ec688',
                        ],
                        sourceNames: ['Server 1', 'Server 2', 'Backup', 'Backup'],
                movieDetails: {
                            title: 'Zee TV HD',
                            rating: '7.6',
                            genre: 'Entertainment',
                            duration: 'Live',
                            description: 'Watch Zee TV HD live'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie16':
                    return {
                        videoSources: [
                            'https://keralamaxtv.com/tof/master.m3u8?id=star_vijay',
                            'https://ed-b002.edgking.me/plyvivo/f06o3ojo2ado3e5ukaro/chunklist.m3u8',
                            'https://bds.jagobd.com:447/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/tracks-v1a1/mono.m3u8',
                            'https://103.lfjustfor.xyz:8088/stream/lizata1/playlist.m3u8?id=43662&pk=e944f4769098ad32bacd383226b8ff3e9a685c9d77dd456d8f362e2a162ec688',
                        ],
                        sourceNames: ['Server 1', 'Server 2', 'Backup', 'Backup'],
                movieDetails: {
                            title: 'Star Vijay',
                            rating: '7.6',
                            genre: 'Entertainment',
                            duration: 'Live',
                            description: 'Watch Star Vijay HD live'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie17':
                    return {
                        videoSources: [
                            'https://keralamaxtv.com/tof/master.m3u8?id=star_plus',
                            'https://ed-b002.edgking.me/plyvivo/f06o3ojo2ado3e5ukaro/chunklist.m3u8',
                            'https://bds.jagobd.com:447/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/tracks-v1a1/mono.m3u8',
                            'https://103.lfjustfor.xyz:8088/stream/lizata1/playlist.m3u8?id=43662&pk=e944f4769098ad32bacd383226b8ff3e9a685c9d77dd456d8f362e2a162ec688',
                        ],
                        sourceNames: ['Server 1', 'Server 2', 'Backup', 'Backup'],
                movieDetails: {
                            title: 'Star Plus',
                            rating: '7.6',
                            genre: 'Entertainment',
                            duration: 'Live',
                            description: 'Watch Star Plus HD live'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie18':
                    return {
                         videoSources: [
                    {
                        url: 'https://58a48a11e736a.streamlock.net/uploads/jio_1437252/30e5981b030f79f1b7cc2c89cdcfe7ed/master.m3u8',
                        type: 'hls'
                    },
                    {
                        url: 'https://aba5sdmaaaaaaaamkycwliah6buj4.otte.live.cf.ww.aiv-cdn.net/pdx-nitro/live/clients/dash/enc/tgcrfjcgia/out/v1/7296f026409c4e9ba8844a238628f9ad/cenc.mpd',
                        type: 'dash',
                        key: 'd1badeadb11f16bbd0ad7d47914d939e',
                        keyId: 'bd52d185d3537c4c1759db6d66f90f31'
                    },
                    {
                        url: 'http://177.53.153.20:8001/play/a01v/index.m3u8',
                        type: 'hls'
                    }
                ],
                        sourceNames: ['Americas Got Talent', 'A&E HD', 'AXN HD', 'Crime Network', 'American Idol', 'Fail Army', 'Pointless UK', 'Wipeout Extra', 'LOL! Network', 'True Crime', 'Real Stories', 'Fashion TV', 'Action Movies - Rakuten TV', 'Top Movies - Rakuten TV', 'Drama Movies - Rakuten TV', 'Romance Movies - Rakuten TV', 'TMZ Live', 'Vice HD', 'Sony Canal Novelas', 'Stingray Spa', 'KMovies', 'Vevo Latino', 'Vevo Hip Hop', 'Fréquence Novelas', 'Televisa TeleNovelas', 'VH1+', 'VH1 Backup', 'Miami TV', 'Weather Spy', 'Bloomberg+'],
                movieDetails: {
                            title: 'English TV',
                            rating: '7.6',
                            genre: 'Entertainment',
                            duration: 'Live',
                            description: 'Select Channels from Dropdown List'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie19':
                    return {
                        videoSources: [
                            'https://spt-sonykal-1-us.lg.wurl.tv/playlist.m3u8',
                            'https://dai.google.com/linear/hls/event/tNzcW2ZhTVaViggo5ocI-A/master.m3u8',
                            'https://dai.google.com/linear/hls/event/x7rXWd2ERZ2tvyQWPmO1HA/master.m3u8',
                            'https://dai.google.com/linear/hls/event/UcjHNJmCQ1WRlGKlZm73QA/master.m3u8',
                            'https://dai.google.com/linear/hls/event/dBdwOiGaQvy0TA1zOsjV6w/master.m3u8',
                            'https://cdn.klowdtv.net/803B48A/n1.klowdtv.net/live1/smc_720p/playlist.m3u8',
                            'https://lnc-tubi-originals.tubi.video/index.m3u8',
                        ],
                        sourceNames: ['Sony Kal', 'Sony Ten 4 HD', 'Sony PIX', 'Sony Max HD', 'SET HD', 'Sony Movies', 'Tubi Originals'],
                movieDetails: {
                            title: 'Sony Channels',
                            rating: '7.6',
                            genre: 'Entertainment',
                            duration: 'Live',
                            description: 'All Sony Channels'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie20':
                    return {
                        videoSources: [
                            'https://live2.notebulk.xyz/uk_sscricket/index.m3u8',
                            'https://live2.notebulk.xyz/uk_ssmain/index.m3u8',
                            'https://live2.notebulk.xyz/us_willow/index.m3u8',
                            'https://userstm.tinyuri.org/live/hs-2160p-sdr-hevc.m3u8',
                            'https://catowrap.live/mrgamingsscric.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109724/hd_akamai_iosmob_avc_kan_ipl_s2_m2230324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109712/hd_akamai_iosmob_avc_tam_ipl_s2_m2230324/master.m3u8',
                            'hhttps://prod-sports-south.jiocinema.com/hls/live/2109718/hd_akamai_iosmob_avc_tel_ipl_s2_m2230324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109762/hd_akamai_iosmob_avc_bhoj_ipl_s2_m2230324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109700/hd_akamai_iosmob_avc_odia_ipl_s2_m2230324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109774/hd_akamai_iosmob_avc_ben_ipl_s1_m2230324/master.m3u8',
                            'hhttps://prod-sports-south.jiocinema.com/hls/live/2109706/hd_akamai_iosmob_avc_mal_ipl_s1_m2230324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109768/hd_akamai_iosmob_avc_mar_ipl_s1_m2230324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109750/hd_akamai_iosmob_avc_guj_ipl_s1_m2230324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109756/hd_akamai_iosmob_avc_pun_ipl_s1_m2230324/master.m3u8',
                            'https://bp1.mrgaminghoster.xyz/mrgamingsoccer2.m3u8',
                            'https://bp1.mrgaminghoster.xyz/hubprem.m3u8',
                            'https://bp1.mrgamingstreams.com/max2.m3u8',
                            'https://bp2.mrgamingstreams.com/mrgamingskyf1tran.m3u8',
                            'https://bp1.mrgamingstreams.com/usan.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109670/hd_akamai_iosmob_avc_cam05_ipl_s1_m1220324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109674/hd_akamai_iosmob_avc_cam01_ipl_s1_m1220324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109673/hd_akamai_iosmob_avc_cam02_ipl_s1_m1220324/master.m3u8',
                            'https://prod-sports-south.jiocinema.comhls/live/2109671/hd_akamai_iosmob_avc_cam04_ipl_s1_m1220324/master.m3u8',
                            'https://prod-sports-south.jiocinema.com/hls/live/2109672/hd_akamai_iosmob_avc_cam03_ipl_s1_m1220324/master.m3u8',
                        ],
                        sourceNames: ['Sky Sports Cricket', 'Sky Sports Main Event', 'Willow HD', 'IPL English HD', 'S Cricket HD', 'IPL Kannada', 'IPL Tamil', 'IPL Telugu', 'IPL Bhojpuri', 'IPL Haryanvi', 'IPL Bengali', 'IPL Malayalam', 'IPL Marathi', 'IPL Gujarati', 'IPL Punjabi', 'Premier League', 'Premier League 2', 'La Liga', 'Sky F1', 'USA', 'IPL Multi View', 'IPL Batter Cam', 'Stump Cam', 'IPL Hero Cam', 'IPL Bulls Eye Cam'],
                movieDetails: {
                            title: 'ICC T20 World Cup 2024',
                            rating: '7.6',
                            genre: 'Cricket',
                            duration: 'Live',
                            description: 'Cricket TV'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie21':
                    return {
                        videoSources: [
                            'https://karostream.tulix.tv/WillowTvHighBitrate/tracks-v1a1/mono.m3u8',
                            'https://the-pet-collective-international-in.samsung.wurl.tv/playlist.m3u8',
                            'https://brandusa-gousa-1-in.samsung.wurl.tv/playlist.m3u8',
                            'https://5a1178b42cc03.streamlock.net/8220/8220/playlist.m3u8',
                            'https://ssh101.bozztv.com/ssh101/swagjatt/chunks.m3u8',
                            'https://lb.streaming.sk/fashiontv/stream/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/ftv_ftv_midnite_k1y_27049_midnite_secr_108_hls.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/ftv_midnite_secrets_adaptive.smil/playlist.m3u8',
                            'https://thedesignnetwork-tdn-6-eu.rakuten.wurl.tv/playlist.m3u8',
                            'https://live-3.otcnet.ru/wfc-int-master/tracks-v1a1/mono.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_pg13_glo_css_43440_1080p_1610_hls.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_pg13_hd_gmt__vm6_43433_default_1597_hls.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_pg16_asi_i2j_43441_1080p_1611_hls.smil/playlist.m3u8',
                            'https://fashs043.cloudycdn.services/scte/africa/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_pg13_hd_uir_43438_vidio_id_1609_hls.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_new_york_9dd_43432_default_1596_hls.smil/playlist.m3u8',
                            'https://vcngfc1.teleosmedia.com/stream/globalfashionchannel/globalfashionchannel/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/store/_definst_/tmsp00043/vod/03/5a/297732/z4b_VICTORIAS__475498.smil/playlist.m3u8',
                        ],
                        sourceNames: ['People are Awesome', 'The Pet Collective', 'Go USA', 'StarNet', 'Swag Jatt', 'FTV Czech and Slovak', 'Fashion TV Midnight Secrets', 'Fashion TV FHD', 'TheDesignNetwork.us', 'WFTV', 'FTV Paris', 'FTV Singapore', 'FTV Mumbai', 'FTV Africa', 'FTV Tokyo', 'FTV NewYork', 'Global Fashion', 'FTV Victorias Secret'],
                movieDetails: {
                            title: 'All TV',
                            rating: '7.6',
                            genre: 'Entertainment & Documentary',
                            duration: 'Live',
                            description: 'Jio Cinema in All Languages'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie22':
                    return {
                        videoSources: [
                            'https://59ec5453559f0.streamlock.net/miamitv/smil:WEB4141/playlist.m3u8',
                            'https://w1.btstream.xyz:2053/tv/pinko/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjIzOjAyIEFNJmhhc2hfdmFsdWU9ZkxwNjdjdWNkSUV6ZU9TeFp2T2hHQT09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/pinkerotic1/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjIzOjQzIEFNJmhhc2hfdmFsdWU9YnlpQ2hJVE0rQ3NCS0piWW9PUzBCUT09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/evilangel/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjI0OjE2IEFNJmhhc2hfdmFsdWU9a2VFc0FOeWxxdi9oZ0xBbUVjcjRNdz09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/playboy/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjI0OjU2IEFNJmhhc2hfdmFsdWU9ZUs4Tk5Ya3d1bktlQTlyQjAzcVBTZz09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/barely/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjI1OjI5IEFNJmhhc2hfdmFsdWU9MC9CY0h6dTNvclV4L21OWExzZ25NQT09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/brazzers/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjI2OjIzIEFNJmhhc2hfdmFsdWU9RzlmRW5xZlN2Yk1vZVRjVCsvTno1UT09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/vivid/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjI2OjU5IEFNJmhhc2hfdmFsdWU9S0RkZmJJYzZ3cVRKSnBZcFh5d2k0QT09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/superone/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjI3OjM5IEFNJmhhc2hfdmFsdWU9Qkg0NzZKQkJHdk8walpkY2NrcEJxUT09JnZhbGlkbWludXRlcz02MA==',
                            'https://w1.btstream.xyz:2053/tv/cento/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MS8xMy8yMDI0IDEyOjI4OjQ1IEFNJmhhc2hfdmFsdWU9bDB3NHFBVGM5QkpKc1gxeDd6M1l5UT09JnZhbGlkbWludXRlcz02MA==',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_pg13_glo_css_43440_1080p_1610_hls.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_pg13_hd_gmt__vm6_43433_default_1597_hls.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_pg16_asi_i2j_43441_1080p_1611_hls.smil/playlist.m3u8',
                            'https://fashs043.cloudycdn.services/scte/africa/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_pg13_hd_uir_43438_vidio_id_1609_hls.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_new_york_9dd_43432_default_1596_hls.smil/playlist.m3u8',
                            'https://vcngfc1.teleosmedia.com/stream/globalfashionchannel/globalfashionchannel/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/store/_definst_/tmsp00043/vod/03/5a/297732/z4b_VICTORIAS__475498.smil/playlist.m3u8',
                            'https://fash1043.cloudycdn.services/slive/_definst_/ftv_midnite_secrets_adaptive.smil/chunklist_b3500000_t64MTA4MHA=.m3u8',
                            'https://59ec5453559f0.streamlock.net/miamitv/smil:WEB4141/playlist.m3u8',
                            'https://59ec5453559f0.streamlock.net/Latino/smil:WEB3131/playlist.m3u8',
                            'https://59ec5453559f0.streamlock.net/JennyLiveMembers/smil:WEB3131/.m3u8',
                            'https://dai.google.com/linear/hls/event/FK1bjW0AThepH1W7CJrByg/master.m3u8',
                            'https://fash2043.cloudycdn.services/slive/ftv_ftv_4k_hevc_73d_42080_default_466_hls.smil/playlist.m3u8',
                        ],
                        sourceNames: ['Ero XXX', 'Pink O Tv', 'Pink Erotic', 'Evil Angel', 'Playboy TV', 'Barely Legal', 'Brazzers', 'Vivid', 'SuperOne', 'Cento', 'FTV Paris', 'FTV Singapore', 'FTV Mumbai', 'FTV Africa', 'FTV Tokyo', 'FTV NewYork', 'Global Fashion', 'FTV Victorias Secret', 'MidNight Hot', 'Miami TV', 'Miami TV 2', 'Jenny Live Members', 'Kaloopy', 'FTV 4K'],
                movieDetails: {
                            title: 'Adult TV',
                            rating: '7.6',
                            genre: 'Entertainment & Documentary',
                            duration: 'Live',
                            description: 'Jio Cinema in All Languages'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
            case 'movie23':
                    return {
                        videoSources: [
                            'https://b-hls-02.doppiocdn.com/hls/141557670/141557670.m3u8',
                            'https://b-hls-15.doppiocdn.com/hls/9976155/9976155.m3u8',
                            'https://b-hls-04.doppiocdn.org/hls/146303394/146303394.m3u8',
                            'https://b-hls-03.doppiocdn.com/hls/128779705/128779705.m3u8',
                            'https://b-hls-22.doppiocdn.com/hls/125138028/125138028.m3u8',
                            'https://b-hls-13.doppiocdn.com/hls/101967831/101967831.m3u8',
                            'https://b-hls-05.doppiocdn.com/hls/12101/12101.m3u8',
                            'https://b-hls-21.doppiocdn.org/hls/42432847/42432847.m3u8',
                            'https://b-hls-01.doppiocdn.com/hls/141350658/141350658.m3u8',
                            'https://b-hls-06.doppiocdn.com/hls/82518408/82518408.m3u8',
                            'https://b-hls-22.doppiocdn.com/hls/134446528/134446528.m3u8',
                            'https://b-hls-21.doppiocdn.org/hls/72941317/72941317.m3u8',
                            'https://edge3-sof.live.mmcdn.com/live-hls/amlst:kittyy_hott_-sd-5ddb2e08bbbfd97318083e8e5a6230cd35ce40ff12f3fa2a1fc1fc811321e33c_trns_h264/chunklist_w938720960_b5128000_t64RlBTOjMwLjA=.m3u8',
                        ],
                        sourceNames: ['Hana', 'Lisa Love', 'Kayra', 'Jhanvi', 'Adiba', 'Rawya', 'Lujain', 'Assal', 'Roxxy', 'Taneil', 'Colombian', 'Fitness Couple', 'Naughty Hooty', 'Lana Rose', 'Sweet Karma', 'KittyyHot', 'Global Fashion', 'FTV Victorias Secret'],
                movieDetails: {
                            title: 'Stripchat',
                            rating: '7.6',
                            genre: 'Entertainment & Documentary',
                            duration: 'Live',
                            description: 'Jio Cinema in All Languages'
                        },
                        availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
                    };
        default:
            return {
                videoSources: 'https://prod-ent-live-gm.jiocinema.com/hls/live/2105488/hd_akamai_iosmob_avc_24x7_bbhindi_day01/master.m3u8',
                sourceNames: ['Main Cam', 'Backup', 'Backup', 'Backup'],
                movieDetails: {
                    title: 'Bigg Boss Hindi Live 24x7',
                    rating: '3.7',
                    genre: 'Reality TV',
                    duration: '24/7',
                    description: 'Description for Bigg Boss Hindi Live 24x7.'
                },
                availableQualities: [144, 240, 360, 480, 720, 1080] // Define available qualities for this video
            };
    }
}
function updatePlayerSource(playerInstance, source) {
    // Pause the player
    playerInstance.pause();

    // Load the new source
    playerInstance.load({
        file: source,
    });

    // Play the player
    playerInstance.play();
}
