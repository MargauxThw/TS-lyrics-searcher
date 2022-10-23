function search(data) {
    new_term = search_input.value

    if (!(new_term.trim() === "")) {
        refreshFilters(new_term, data)

        document.getElementById('search').value = null
        search_input = document.getElementById('search')

        window.goatcounter.count({
            path:  'search',
            title: new_term,
            event: true,
        })
    }

    displayResults(data)
}