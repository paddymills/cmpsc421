const {createApp} = Vue;

createApp({
    data() {
        return {
            name: 'Mike',
            age: 43
        }
    }, methods: {
        setDefaults: function() {
            this.name = 'Mike';
            this.age = 43;
        }
    }
}).mount('#app');
