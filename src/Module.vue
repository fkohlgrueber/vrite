<template>
  <div ref="elmt"
        class="astnode"
        style="min-height: 80vh; "
        tabindex="-1"
        @keyup.stop="onKey"
        @keydown.delete.prevent.stop
        @click.stop="focus">
    <div v-for="(s, idx) in data.body">
      <nodecomp :data="s" ref="elmts" :parent="thisNode" :idx="idx"></nodecomp>
    </div>
  </div>
</template>

<script>
    import nodeBase from "./nodeBase";
    import nodecomp from "./nodecomp";
    export default {
        name: "Module",
        mixins: [nodeBase],
        components: {nodecomp},
        props: {
          data: Object,
          avail_width: Number,
        },
      methods: {
        get_children: function () {
          let x = this.$refs.elmts.sort(function (a, b) {
            return a.idx-b.idx;
          }).map(function (x) {
            return x.get_node();
          });
          return x
        },
        replace_child: function(child, new_data, delete_from_list=true) {
          let child_idx = this.get_children().indexOf(child);
          if (child_idx<0) {
            console.log("Invalid Child Index!!!");
            return;
          }
          if (new_data !== null){
            this.$set(this.data.body, child_idx, new_data);
            this.$nextTick(function () {
              this.get_children()[child_idx].focus();
            });
          }else {
            if (delete_from_list){
              this.data.body.splice(child_idx, 1);
            }else {
              this.$set(this.data.body, child_idx, {type: "stmt"});
            }
            if (this.data.body.length===0){
              this.data.body.push({type: "stmt"});
            }
            let new_focus_idx = Math.min(this.data.body.length-1, child_idx);
            this.$nextTick(function () {
              this.get_children()[new_focus_idx].focus();
            });
          }
        },
        get_commands: function () {
          return this.get_base_commands().concat([
            [",", "insert statement after", this.append_child, function () {return true;}],
            [";", "insert statement before", this.insert_child_before, function () {return true;}],
          ]);
        },
        get_child_commands: function (child) {
          const thisNode = this;
          return [
            [";", "insert statement before", function() {thisNode.insert_child(child, false)}, function () {return true;}],
            [",", "insert statement after", function() {thisNode.insert_child(child, true)}, function () {return true;}],
          ];
        },
        append_child: function() {
          this.insert_child(null, true);
        },
        insert_child_before: function() {
          this.insert_child(null, false);
        },
        insert_child: function (child=null, after=true) {
          let child_idx = (child===null) ? after * this.data.body.length: this.get_children().indexOf(child)+after;
          console.log(child);
          console.log(child_idx);
          this.data.body.splice(child_idx, 0, {type: "stmt"});
          this.$nextTick(function () {
            this.get_children()[child_idx].focus();
          });
        }
      },
      computed: {
      },
      beforeCreate: function () {
        this.$options.components.nodecomp = require('./nodecomp.vue').default;
      }
    }
</script>

<style scoped>

</style>
