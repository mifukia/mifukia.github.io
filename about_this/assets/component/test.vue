<template>
<div class="box">
    <p v-if="isVisible">
        {{message}}
    </p>
    <p class="txt">
        {{txt}}
    </p>
    <img :src="'/assets/img/'+img" alt="" v-on:click="clickEV()" class="rp">
    </div>
</template>

<style scoped lang="scss">
    @mixin sp {
        @media print, screen and (max-width: 640px) {
            @content;
        }
    }
    .box{
        padding: 10/640*100%;
        background: blue;
        margin-top: 10px;
        @include sp{
            background: blue;
        }
        p{
            font-size: 20px;
            color: red;
        }
    }
</style>

<script>
export default {
    props:['txt','img'],
    data: function() {
        return {
            message: 'コ'
        }
    },
    computed: {
        isVisible: function() {
            if (this.message) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        clickEV:function(){
            alert('click!');
        }
    }
}
</script>




