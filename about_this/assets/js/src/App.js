import Vue from 'vue';
process.env.NODE_ENV = 'production';

new Vue({
    el: '#test',
    components: {
        'vue-test': require('../../component/test.vue'),
    }
});









