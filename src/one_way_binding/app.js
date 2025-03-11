const {createApp} = Vue;

createApp({
    data() {
        return {
            name: 'Steve',
            job: 'Electrician',
            website: 'https://steve.com',
            websiteTag: `<a href="https://steve.com">Our Website</a>`
        }
    }, methods: {

    }
}).mount('#app');
