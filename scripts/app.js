fetch('https://raw.githubusercontent.com/MargauxThw/TS-lyrics/main/AllDataMar2123.json')
    .then(response => response.json())
    .then(data => runApp(data))
    .catch(err => console.log(err));


const album_order = ["midnights", "evermore", "folklore", "Lover", "Reputation", "1989", "Red (Taylor's Version)", "Speak Now", "Fearless (Taylor's Version)", "Taylor Swift", "Unreleased", "Singing Credits Only", "Talkshow Parody", "Unspecified Album", "EP: Sounds Of The Season: The Taylor Swift Holiday Collection"]

const num_albums = 10

function hexToRgbA(hex) {
    var c
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('')
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c= '0x'+c.join('')
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.25)'
    }
}


function getAlbumId(index) {
    return album_order[index].split(" ")[0].toLowerCase()
}


function getOtherId(index, data) {
    o = Object.keys(data)[index].split(" ")[0].toLowerCase()
    o = o.split(":")[0]
    return o
}


function getSongShortened(title) {
    title_ids = title.split(" ")[0].toLowerCase()

    if (title_ids === "love" || title_ids === "beautiful" || title_ids === "my" 
        || title_ids === "this" || title_ids === "what" || title_ids === "your") {
            title_ids = [title.split(" ")[0].toLowerCase(), title.split(" ")[1].toLowerCase()].join("-")
        }

    if (title_ids === "i" || title_ids === "the" || title_ids === "a") {
        title_ids = title.split(" ")[1].toLowerCase()
    }

    title_ids = title_ids.replace("'", "")
    title_ids = title_ids.replace("!", "")
    title_ids = title_ids.replace("?", "")
    title_ids = title_ids.replace("...", "")
    title_ids = title_ids.replace(".", "")

    return title_ids
}


function fillSongFilters(data) {
    data_filters = {}

    for (album in data) {
        for (song in data[album]) {
            index = album_order.indexOf(album)
            if (index < num_albums) {
                data_filters["albums-" + getAlbumId(album_order.indexOf(album)) + "-" + getSongShortened(song)] = true
            } else {
                data_filters["other-" + getOtherId(album_order.indexOf(album), data) + "-" + getSongShortened(song)] = true
            }
        }
    }

    return data_filters
}


function runApp(data) {
    full = false
    matchingCase = false
    allFilters = false
    hideSurr = false

    data_filters = fillSongFilters(data)

    search_input = document.getElementById('search')
    submit = document.getElementById('submit')
    settings = document.getElementById('settings')
    settings_close = document.getElementById('settings-close')
        
    submit.addEventListener('click', (e) => {
        search(data)
        window.goatcounter.count({
            path:  'Search by button',
            title: 'action',
            event: true,
        })
    })

    search_input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            search(data)
            window.goatcounter.count({
                path:  'Search by enter',
                title: 'action',
                event: true,
            })
        }
    })

    settings.addEventListener('click', (e) => {
        openSettings(data)
        window.goatcounter.count({
            path:  'Open Settings',
            title: 'action',
            event: true,
        })
    })

    settings_close.addEventListener('click', (e) => {
        openSettings(data)
        window.goatcounter.count({
            path:  'Close Settings',
            title: 'action',
            event: true,
        })
        
    })

    document.getElementById("link-to-quiz").addEventListener('click', (e) => {
        window.goatcounter.count({
            path:  'Click link to quiz',
            title: 'action',
            event: true,
        })
    })

}