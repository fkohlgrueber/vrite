<template>
    <span ref="elmt"
          class="astnode invalidInput"
          tabindex="-1"
          @keyup.stop="onKey"
          @click.stop="focus"
    >&lt;expr&gt;</span>
</template>

<script>
    import nodeBase from "./nodeBase";

    export default {
        name: "expr",
        mixins: [nodeBase],
        methods: {
          get_children: function () {
            return [];
          },
          get_commands: function () {
            const thisNode = this;
            return this.get_base_commands().concat([
              ["s", "Name", function(){thisNode.parent.replace_child(thisNode, {type: "Name", id: ""})}, function () {return true;}],
              ["n", "Num", function(){thisNode.parent.replace_child(thisNode, {type: "Num", n: ""})}, function () {return true;}],
            ]);
          },
        },
        computed: {
          is_meta_node: function () {
            return true;
          },
        }
    }
</script>

<style scoped>
  .invalidInput {
    background-color: lightpink;
  }

</style>
