const {createApp} = Vue;

createApp({
    data() {
        return {
            person: 'Mike',
            course: 'CMPSC221',
            weather: 'cold'
        }
    }, methods: {

    }
}).mount('#app');
