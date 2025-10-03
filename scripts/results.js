const evermore = ["#fe8c00", "#BC0000"]
const folklore = ["#878787", "#323232"]
const lover = ["#FFA8FF", "#5C8BC4"]
const reputation = ["#4F7C51", "#000000"]
const nineteen = ["#8EBAFB", "#726ACF"]
const red = ["#DE8CA3", "#AE1E49"]
const speak = ["#9863DC", "#731270"]
const fearless = ["#FFBA52", "#B67B09"]
const debut = ["#3AA6ED", "#1B6069"]
const midnights = ["#88ABBE", "#020F3A"]
const other = ["#242424", "#000000", "#FFFFFF"]
const ttpd = ["#A9A092", "#241F1C"]
const tloasg = ["#79E5AC", "#03514D"]

const colours = [tloasg, ttpd, midnights, evermore, folklore, lover, reputation, nineteen, red,
    speak, fearless, debut, other, other, other, other, other, other, other, other
]
const symbols = [" ", ",", "'", "(", ")", ":", "?"]


function isOneOf(c, l) {
    is = false
    for (i in l) {
        if (l[i] === c) {
            is = true
        }
    }

    return is
}


function getResults(data) {
    terms = getFilterTerms()

    objResults = []

    for (album in data) {
        // If album filtered out: continue;
        for (song in data[album]) {
            // If song filtered out: continue;
            index = album_order.indexOf(album)
            if (index < num_albums) {
                id = getAlbumId(album_order.indexOf(album)) + "-" + getSongShortened(song)
                if (!data_filters["albums-" + id]) {
                    continue
                }

            } else {
                id = getOtherId(album_order.indexOf(album), data) + "-" + getSongShortened(song)
                if (!data_filters["other-" + id]) {
                    continue
                }
            }

            for (line in data[album][song]) {
                including = []
                for (term in terms) {
                    including.push(false)

                    if (!full) {
                        l = data[album][song][line]["this"]
                        t = terms[term]

                        if (!matchingCase) {
                            l = l.toLowerCase()
                            t = t.toLowerCase()

                        }

                        if (l.includes(t)) {
                            including[term] = true
                        }

                    } else { // if full only!
                        t = terms[term]
                        l = data[album][song][line]["this"]

                        if (!matchingCase) {
                            t = t.toLowerCase()
                            l = l.toLowerCase()
                        }

                        s = l.split(t)

                        if (l.includes(t)) {
                            // Check if full line!
                            if (s.length == 2 && s[0] === "" && s[1] === "") {
                                including[term] = true
                            }

                            if (s.length == 2 && (s[0] === "" || s[1] === "")) {
                                // At the start
                                if (l.slice(0, t.length) === t &&
                                    (l[t.length - 1] === " " ||
                                        isOneOf(s[1][0], symbols))) {
                                    including[term] = true
                                }

                                // At the end
                                if (l.slice(l.length - t.length) === t &&
                                    (t[0] === " " ||
                                        isOneOf(s[s.length - 2][s[s.length - 2].length - 1], symbols))) {
                                    including[term] = true
                                }

                            } else {
                                // Everywhere else
                                for (i = 0; i < s.length - 1; i++) {
                                    pre = s[i][s[i].length - 1]
                                    post = s[i + 1][0]
                                    if ((t[0] === " " ||
                                            isOneOf(pre, symbols)) &&
                                        (t[t.length - 1] === " " ||
                                            isOneOf(post, symbols))) {

                                        including[term] = true
                                        break
                                    }

                                }
                            }
                        }
                    }
                }

                if (including.length == 0) { // no terms = no results!
                    return []
                }

                if (allFilters) {
                    if (including.every((e) => {
                            return e
                        })) {
                        item = data[album][song][line]
                        item.song = song
                        item.album = album
                        objResults.push(item)
                    }

                } else {
                    for (i in including) {
                        if (including[i]) {
                            item = data[album][song][line]
                            item.song = song
                            item.album = album
                            objResults.push(item)
                            break
                        }
                    }

                }
            }
        }
    }

    objResults.sort(function (a, b) {
        return album_order.indexOf(a.album) - album_order.indexOf(b.album)
    })

    return objResults

}


function updateNum(num) {
    num_results = document.getElementById("num-results")
    if (num == 1) {
        num_results.innerHTML = "<b>1</b> matching line was found"
    } else {
        num_results.innerHTML = "<b>" + num + "</b> matching lines were found"
    }

}


function processText(line) {
    terms = getFilterTerms()
    indices = []
    terms.sort(function (a, b) {
        return a.length - b.length
    })

    new_line = line


    for (term in terms) {
        s = 0
        instance = new_line
        t = terms[term]

        if (!matchingCase) {
            instance = instance.toLowerCase()
            t = terms[term].toLowerCase()
        }

        while (instance.includes(t)) {
            start = instance.indexOf(t) + s

            if (start >= 0) {
                if (full) {
                    if (start == 0 || isOneOf(new_line[start - 1], symbols) || isOneOf(t[0], symbols)) {
                        if (start + t.length == new_line.length || isOneOf(new_line[start + t.length], symbols) || isOneOf(t[t.length - 1], symbols)) {
                            indices.push([start, start + t.length - 1])
                        }
                    }

                } else {
                    indices.push([start, start + t.length - 1])

                }
                instance = new_line.slice(start + 1)
                if (!matchingCase) {
                    instance = instance.toLowerCase()
                }
                s = start + 1

            } else {
                break
            }
        }
    }


    indices.sort(function (a, b) {
        return a[0] - b[0]
    })

    final_indices = []

    for (i = 0; i < indices.length; i++) {
        start = indices[i][0]
        end = indices[i][1]
        for (j = i + 1; j < indices.length; j++) {
            if (indices[j][0] <= end) {
                if (indices[j][1] > end) {
                    end = indices[j][1]
                }
            } else {
                break
            }
        }

        i = j - 1
        final_indices.push([start, end])

    }

    new_lyric = []

    for (i = 0; i < final_indices.length; i++) {

        if (i == 0 && final_indices[i][0] != 0) {
            new_lyric.push(new_line.slice(0, final_indices[i][0]))
        }

        new_lyric.push("<u>")
        new_lyric.push(new_line.slice(final_indices[i][0], final_indices[i][1] + 1))
        new_lyric.push("</u>")

        if (i == final_indices.length - 1) {
            if (final_indices[i][1] != new_line.length - 1) {
                new_lyric.push(new_line.slice(final_indices[i][1] + 1, new_line.length + 1))

            }

        } else {
            new_lyric.push(new_line.slice(final_indices[i][1] + 1, final_indices[i + 1][0]))

        }
    }

    new_line = new_lyric.join("")
    new_line = "<b>" + new_line + "</b>"

    return new_line
}


function displayResults(data) {
    results = document.getElementById("results")
    results.innerHTML = "";
    objResults = getResults(data)
    updateNum(objResults.length)

    // Grouped results feature
    if (typeof groupResults !== 'undefined' && groupResults) {
        // Group by album, then by song
        const grouped = {};
        for (const r of objResults) {
            if (!grouped[r.album]) grouped[r.album] = {};
            if (!grouped[r.album][r.song]) grouped[r.album][r.song] = [];
            grouped[r.album][r.song].push(r);
        }
        // For each album
        Object.keys(grouped).forEach(album => {
            const albumIndex = album_order.indexOf(album);
            const albumResults = grouped[album];
            const albumSongCount = Object.keys(albumResults).length;
            let albumLineCount = 0;
            Object.values(albumResults).forEach(lines => albumLineCount += lines.length);

            // Album border color (use first gradient color)
            const borderColor = colours[albumIndex][0];

            // Album accordion
            const albumLi = document.createElement('li');
            albumLi.className = 'group-album';
            albumLi.style.width = '100%';
            // Accordion header
            const albumHeader = document.createElement('button');
            albumHeader.className = 'group-accordion';
            albumHeader.innerHTML = `
                <span class="chevron">&#8250;</span>
                <span class="album-text">${album}</span>
                <span class="group-accordion-meta">
                  <span class="pill">${albumSongCount} song${albumSongCount !== 1 ? 's' : ''}</span>
                  <span class="pill">${albumLineCount} line${albumLineCount !== 1 ? 's' : ''}</span>
                </span>
            `;
            albumHeader.style.setProperty('--album-border', borderColor);
            // ...modern styles handled by CSS...
            const albumContent = document.createElement('ul');
            albumContent.style.display = 'none';
            albumContent.style.flexDirection = 'column';
            albumContent.style.width = '100%';
            albumContent.style.background = 'none'; // Remove background color
            albumContent.style.padding = '0 0 0 0';
            albumContent.style.margin = '0';
            // Toggle
            albumHeader.addEventListener('click', () => {
                const open = albumContent.style.display === 'flex';
                albumContent.style.display = open ? 'none' : 'flex';
                albumHeader.classList.toggle('open', !open);
            });
            // For each song in album
            Object.keys(albumResults).forEach(song => {
                const songResults = albumResults[song];
                // Song accordion
                const songLi = document.createElement('li');
                songLi.className = 'group-song';
                songLi.style.width = '100%';
                // Song header
                const songHeader = document.createElement('button');
                songHeader.className = 'group-accordion-secondary';
                // Get the dark shade for the album
                const chevronColor = colours[albumIndex][1];
                songHeader.innerHTML = `
                  <span class="chevron chevron-song" style="color: ${chevronColor}">&#8250;</span>
                  <p class="song-accordion-title">${song}</p>
                  <span class="group-accordion-secondary-meta">
                    <span class="pill">${songResults.length} line${songResults.length !== 1 ? 's' : ''}</span>
                  </span>
                `;
                // ...modern styles handled by CSS...
                const songContent = document.createElement('ul');
                songContent.style.display = 'none';
                songContent.style.flexDirection = 'column';
                songContent.style.width = '100%';
                songContent.style.background = '#fff';
                songContent.style.padding = '0 0 0 0';
                songContent.style.margin = '0';
                // Toggle
                songHeader.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const open = songContent.style.display === 'flex';
                    songContent.style.display = open ? 'none' : 'flex';
                    songHeader.classList.toggle('open', !open);
                });
                // Render lyric cards as normal
                for (const obj of songResults) {
                    const result = document.createElement('li');
                    result.className = 'result';
                    result.style.background = `linear-gradient(${colours[albumIndex][0]}, ${colours[albumIndex][1]})`;
                    result.style.boxShadow = `0px 6px 10px ${hexToRgbA(colours[albumIndex][1])}`;
                    result.style.margin = '8px 0';
                    const container = document.createElement('div');
                    container.className = 'result-container';
                    result.appendChild(container);
                    const rtop = document.createElement('ul');
                    rtop.className = 'results-top';
                    // Only show section/line info
                    const songSection = document.createElement('li');
                    songSection.className = 'song-section grouped';
                    songSection.innerHTML = `<b>Line ${obj.num}</b> ${obj.section}`;
                    rtop.appendChild(songSection);
                    container.appendChild(rtop);
                    const hr = document.createElement('hr');
                    hr.className = 'results-sep';
                    hr.style.background = colours[albumIndex][2] || colours[albumIndex][0];
                    container.appendChild(hr);
                    if (!hideSurr) {
                        const prev = document.createElement('p');
                        prev.className = 'prev';
                        prev.textContent = obj.prev;
                        const next = document.createElement('p');
                        next.className = 'next';
                        next.textContent = obj.next;
                        container.appendChild(prev);
                        const lyric = document.createElement('p');
                        lyric.className = 'lyrics';
                        lyric.innerHTML = processText(obj.this);
                        container.appendChild(lyric);
                        container.appendChild(next);
                    } else {
                        const lyric = document.createElement('p');
                        lyric.className = 'lyrics';
                        lyric.innerHTML = processText(obj.this);
                        lyric.style.padding = '8px 0 16px 0';
                        container.appendChild(lyric);
                    }
                    songContent.appendChild(result);
                }
                songLi.appendChild(songHeader);
                songLi.appendChild(songContent);
                albumContent.appendChild(songLi);
            });
            albumLi.appendChild(albumHeader);
            albumLi.appendChild(albumContent);
            results.appendChild(albumLi);
        });
        return;
    }
    for (i in objResults) {
        result = document.createElement("li")
        result.className = "result"
        index = album_order.indexOf(objResults[i].album)
        result.style.background = "linear-gradient(" + colours[index][0] + ", " + colours[index][1] + ")"
        result.style.boxShadow = "0px 6px 10px " + hexToRgbA(colours[index][1])
        results.appendChild(result)

        container = document.createElement("div")
        container.className = "result-container"
        result.appendChild(container)

        rtop = document.createElement("ul")
        rtop.className = "results-top"

        album = document.createElement("li")
        album.className = "album"
        album.textContent = objResults[i].album.toUpperCase()
        rtop.appendChild(album)

        song = document.createElement("li")
        song.className = "song-section"
        song.innerHTML = "<b>" + objResults[i].song + "</b>" + " " + "Line " + objResults[i].num.toString() + " " + objResults[i].section
        rtop.appendChild(song)

        container.appendChild(rtop)

        hr = document.createElement("hr")
        hr.className = "results-sep"
        if (colours[index].length < 3) {
            hr.style.background = colours[index][0]

        } else {
            hr.style.background = colours[index][2]

        }
        container.appendChild(hr)

        if (!hideSurr) {
            prev = document.createElement("p")
            prev.className = "prev"
            prev.textContent = objResults[i].prev
            
            next = document.createElement("p")
            next.className = "next"
            next.textContent = objResults[i].next
        }

        lyric = document.createElement("p")
        lyric.className = "lyrics"
        lyric.innerHTML = processText(objResults[i].this)

        if (!hideSurr) {
            container.appendChild(prev)
            container.appendChild(lyric)
            container.appendChild(next)
        } else {
            lyric.style.padding = "8px 0 16px 0"
            container.appendChild(lyric)
        }
        
    }

}