updateOptions = (id, data) => {
    return () => {
        check(id, data)
        search(data)
    }
}

updateBoxes = (id, data) => {
    return () => {
        check(id, data)
    }
}


function openSettings(data) {
    settingsPop = document.getElementById("settings-pop")
    inputs = document.getElementById("inputs")

    if (settingsPop.style.display == "block") {
        settingsPop.style.display = "none"
        inputs.style.display = "flex"
    } else {
        settingsPop.style.display = "block"
        inputs.style.display = "none"
    }

    searchOptions = document.getElementsByClassName("search-option")
    for (i in searchOptions) {
        searchOptions[i].onclick = updateOptions(searchOptions[i].id, data)
    }

    generateRows(data)
}


function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function generateRows(data) { // Creates all drop down rows
    song_style1 = "style='margin-right: 0;'>"
    song_style2 = "style='border: #ebebeb; background: #ebebeb; color: black;'>"
    style_hide = "style='display: none;'>"

    // Albums
    albums = document.getElementById("li-albums")

    if (document.getElementById("ul-albums") == null) {
        ul1 = document.createElement("ul") // List of all albums
        ul1.id = "ul-albums"
        ul1.style.display = "none"

        // Add all album name drop downs
        for (i = 0; i < num_albums; i++) {
            album_name = getAlbumId(i)

            li = document.createElement("li")
            li.className = "checkbox-row"
            li.id = "li-albums-" + album_name

            li.innerHTML = "<button class='search-filter custom-checkbox checked'" +
                "id='box-albums-" + album_name + "'>" +
                "<i class='fa fa-check'></i>" +
                "</button>" +
                "<button class='drop-down'" +
                "id='drop-albums-" + album_name + "'" +
                "onclick='drop(this.id)' " +
                "style='" +
                "background: linear-gradient(" + colours[i][0] + ", " + colours[i][1] + ");"
                + "border: 2px solid " + colours[i][1] + ";" +
                "'>" +
                "<h3>" + album_order[i] + "</h3>" +
                "<i class='fa fa-chevron-up drop'" +
                "id='icon-albums-" + album_name + "'></i>" +
                "</button>"

            ul1.appendChild(li)

            ul2 = document.createElement("ul") // list all songs in every album
            ul2.id = "ul-albums-" + album_name
            ul2.style.display = "none"

            songs = Object.keys(data[album_order[i]])

            for (j = 0; j < songs.length; j++) {
                song_name = getSongShortened(songs[j])
                song = document.createElement("li")
                song.className = "checkbox-row"
                song.id = "li-albums-" + album_name + "-" + song_name

                song.innerHTML = "<button class='search-filter custom-checkbox checked'" +
                    "id='box-albums-" + album_name + "-" + song_name + "' " +
                    song_style1 +
                    " <i class='fa fa-check'></i>" +
                    "</button>" +
                    "<button class='drop-down' " +
                    "id='drop-albums-" + album_name + "-" + song_name + "' " +
                    song_style2 +
                    "<h3>" + songs[j] + "</h3> " +
                    "</button>"

                ul2.appendChild(song)

            }

            insertAfter(ul2, li)

        }

        insertAfter(ul1, albums)
    }


    // Other
    others = document.getElementById("li-other")

    if (document.getElementById("ul-other") == null) {

        ul1 = document.createElement("ul") // List of all other
        ul1.id = "ul-other"
        ul1.style.display = "none"

        // Add all other name drop downs
        for (i = num_albums; i < album_order.length; i++) {
            album_name = getOtherId(i, data)

            li = document.createElement("li")
            li.className = "checkbox-row"
            li.id = "li-other-" + album_name

            li.innerHTML = "<button class='search-filter custom-checkbox checked'" +
                "id='box-other-" + album_name + "'>" +
                " <i class='fa fa-check'></i> " +
                "</button>" +
                "<button class='drop-down'" +
                "id='drop-other-" + album_name + "'" +
                "onclick='drop(this.id)' " +
                "style='" +
                "background: black;" +
                "border: 2px solid black;" +
                "'>" +
                "<h3>" + album_order[i] + "</h3>" +
                "<i class='fa fa-chevron-up drop'" +
                "id='icon-other-" + album_name + "'></i>" +
                "</button>"

            ul1.appendChild(li)

            ul2 = document.createElement("ul") // list all songs in every album
            ul2.id = "ul-other-" + album_name
            ul2.style.display = "none"

            songs = Object.keys(data[album_order[i]])

            for (j = 0; j < songs.length; j++) {
                song_name = getSongShortened(songs[j])
                song = document.createElement("li")
                song.className = "checkbox-row"
                song.id = "li-other-" + album_name + "-" + song_name

                song.innerHTML = "<button class='search-filter custom-checkbox checked'" +
                    "id='box-other-" + album_name + "-" + song_name + "'" +
                    song_style1 +
                    " <i class='fa fa-check'></i>" +
                    "</button>" +
                    "<button class='drop-down' " +
                    "id='drop-other-" + album_name + "-" + song_name + "' " +
                    song_style2 +
                    "<h3>" + songs[j] + "</h3> " +
                    "</button>"

                ul2.appendChild(song)

            }

            insertAfter(ul2, li)

        }

        insertAfter(ul1, others)
    }


    searchFilters = document.getElementsByClassName("search-filter")
    for (i in searchFilters) {
        searchFilters[i].onclick = updateBoxes(searchFilters[i].id, data)
    }
}


function uncheck(move, elem) {
    c = elem.className.split(" ")

    if (!move && c.length > 2) { // Uncheck if applicable
        elem.className = [c[0], c[1]].join(" ")
        elem.innerHTML = ""
    }
}


function checkParent(move, elem) {
    icon = "<i class='fa fa-check'></i>"
    children_checked = true

    if (elem == null || move == false) {
        return
    }

    // Cycle through all children - set false and break if one not
    suffix = elem.id.split("-")
    suffix = suffix.slice(1).join("-")
    selector = '*[id^="box-' + suffix + '-"]'
    children = document.querySelectorAll(selector);

    for (i = 0; i < children.length; i++) {
        c = children[i].className.split(" ")
        if (c.length != 3) {
            children_checked = false
            break
        }
    }

    if (children_checked) { // Check parent
        c = elem.className.split(" ")

        if (c.length <= 2) {
            c.push("checked")
            elem.className = c.join(" ")
            elem.innerHTML = icon
        }

    }
}


function toggleSongFilters(ids, move, data) {
    ids = ids.slice(1)
    prefix = ids.join("-")

    for (i = 0; i < Object.keys(data_filters).length; i++) {
        id = Object.keys(data_filters)[i]

        if (id.split(prefix).length == 2 && id.split(prefix)[0] === ""
            && (id.split(prefix)[1] === "" || id.split(prefix)[1][0] === "-")) {

            data_filters[Object.keys(data_filters)[i]] = move

        }
    }

    displayResults(data)
}



function check(id, data) {
    icon = "<i class='fa fa-check'></i>"

    box = document.getElementById(id)
    c = box.className.split(" ")

    move = true // true = check children, false = uncheck children

    if (c.length > 2 && c[2] === "checked") {
        // Toggle to false
        box.className = [c[0], c[1]].join(" ")
        box.innerHTML = ""

        move = false

    } else {
        // Toggle to true
        box.className += " checked"
        box.innerHTML = icon

        move = true

    }

    if (id === "case-sensitive") {
        matchingCase = !matchingCase
        if (matchingCase) {
            window.goatcounter.count({
                path: id,
                title: 'action',
                event: true,
            })
        }
        return
    } else if (id === "all-terms") {
        allFilters = !allFilters
        if (allFilters) {
            window.goatcounter.count({
                path: id,
                title: 'action',
                event: true,
            })
        }
        return
    } else if (id === "full-words") {
        full = !full
        if (full) {
            window.goatcounter.count({
                path: id,
                title: 'action',
                event: true,
            })
        }
        return
    } else if (id === "hide-surr") {
        hideSurr = !hideSurr
        if (hideSurr) {
            window.goatcounter.count({
                path: id,
                title: 'action',
                event: true,
            })
        }
        return
    }

    suffix = id.split("-")
    suffix = suffix.slice(1).join("-")
    selector = '*[id^="box-' + suffix + '-"]'
    children = document.querySelectorAll(selector);

    // Toggle children
    for (i = 0; i < children.length; i++) {
        c = children[i].className.split(" ")
        if (move) { // Toggle to checked
            if (c.length <= 2) {
                c.push("checked")
                children[i].className = c.join(" ")
                children[i].innerHTML = icon
            }

        } else { // Toggle to unchecked
            if (c.length > 2) {
                children[i].className = [c[0], c[1]].join(" ")
                children[i].innerHTML = ""
            }
        }
    }

    // Toggle parents (if applicable)

    // LOGIC:

    // If all children are checked -> toggle to checked
    // i.e. if box checked, ???

    // If not all children are checked -> toggle to unchecked
    // i.e. if box unchecked, uncheck all parents

    top_par = null
    sec_par = null

    ids = box.id.split("-")
    toggleSongFilters(ids, move, data)

    if (ids.length > 3) {
        sec_par = document.getElementById([ids[0], ids[1], ids[2]].join("-"))

        uncheck(move, sec_par)

        checkParent(move, sec_par)

    }

    if (ids.length > 2) {
        top_par = document.getElementById([ids[0], ids[1]].join("-"))

        uncheck(move, top_par)

        // if move & top_par's children are checked -> check top_par
        checkParent(move, top_par)

    }
}

function drop(id) {
    suffix = id.split("-")
    suffix = suffix.slice(1).join("-")
    ul = document.getElementById("ul-" + suffix)

    currIcon = document.getElementById("icon-" + suffix)
    if (currIcon.className === "fa fa-chevron-down drop") {
        currIcon.className = "fa fa-chevron-up drop"

        // Close children
        ul.style.display = "none"

    } else {
        currIcon.className = "fa fa-chevron-down drop"

        // Open children
        ul.style.display = "flex"

    }
}