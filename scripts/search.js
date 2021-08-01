function search(data) {
    new_term = search_input.value

    if (!(new_term.trim() === "")) {
        refreshFilters(new_term, data)

        document.getElementById('search').value = null
        search_input = document.getElementById('search')
    }

    displayResults(data)
}