const {createApp} = Vue;

createApp({
    data() {
        return {
            movies: ['Borderlands', 'Star Wars', 'Waterworld'],
            actors: [
                {'name': "Tom Holland", 'activity': "Spiderman"},
                {'name': "matthew mcconaughey", 'activity': "Interstellar"},
                {'name': "jk simmons ", 'activity': "whiplash"},
            ]
        }
    }, methods: {}
}).mount('#app');
