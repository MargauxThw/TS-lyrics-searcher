function getFilterTerms() {
    filters = document.getElementById("filter-container")

    terms = []
    for (i = 0; i < filters.children.length; i++) {
        terms.push(filters.children[i].textContent)
    }
    return terms
}


closeFilter = (i, data) => {
    return () => {
        filter = document.getElementById("filter-" + i.toString())
        filters.removeChild(filter)
        refreshFilters(null, data)
        search(data)
    }
}


function refreshFilters(new_term, data) {
    filters = document.getElementById("filter-container")

    terms = getFilterTerms()

    if (new_term != null) {
        terms.push(new_term)
    }

    filters.innerHTML = ""
    for (i = 0; i < terms.length; i++) {
        close = document.createElement("a")
        close.className = "close"
        close.onclick = closeFilter(i, data)

        newFilter = document.createElement("li")
        newFilter.className = "filter"
        newFilter.id = "filter-" + i.toString()

        newFilter.textContent = terms[i]

        newFilter.appendChild(close)
        filters.appendChild(newFilter)

    }

    displayResults(data)
}