<template>
  <component v-bind:is="data.type" :data="data" :parent="parent" ref="elmt" :reqPrecedence="reqPrecedence"></component>
</template>

<script>
  import BinOp from "./BinOp";
  import Num from "./Num";
  import stmt from "./stmt";
  import Name from "./Name";
  export default {
    name: "nodecomp",
    components: {BinOp, Num, stmt, Name},
    props: {
      data: Object,
      parent: Object,
      reqPrecedence: Number,
      idx: Number,
    },
    methods: {
      get_node: function () {
        return this.$refs.elmt;
      }
    },
    beforeCreate: function () {
      this.$options.components.expr = require('./expr.vue').default;
    }
  }
</script>

<style scoped>

</style>
