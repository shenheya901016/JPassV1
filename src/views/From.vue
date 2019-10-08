<template>
    <div class="home">
        <div>
            <input type="button" value="+" @click="add">
            <input type="button" value="-" v-on:click="sub">
        </div>
        <div style="margin-top: 10px" v-for="(item,index) in list">
            序号:<span>{{index+1}}</span>
            id:<input type="text" :value="item.id">
            名称:<input type="text" :value="item.name" style="margin-left: 10px">
        </div>
    </div>
</template>

<script>
    export default {
        name: "from",
        data() {
            return {
                list: [
                    {id: 1, name: 'zs1'},
                    {id: 2, name: 'zs2'},
                    {id: 3, name: 'zs3'},
                    {id: 4, name: 'zs4'},
                    {id: 5, name: 'zs5'},
                    {id: 6, name: 'zs6'},
                ]
            }
        },
        components: {},
        methods: {
            add() {
                let id = this.list[this.list.length-1].id;

                this.list.push({id: id+1, name: 'zs' + id});
            },
            sub() {
                console.log(1);
                this.list.pop();
            }
        }
    };
</script>
