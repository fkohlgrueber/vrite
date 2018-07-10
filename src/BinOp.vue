<template>
    <span ref="elmt"
          class="astnode"
          tabindex="-1"
          @keyup.stop="onKey"
          @click.stop="focus"
    ><transition name="fade"><span class="parens" v-if="show_parens">(</span></transition
      ><nodecomp :data="data.left" :parent="thisNode" ref="left" :reqPrecedence="precedence"></nodecomp
      >&nbsp;<EditableText :content="op_str" ref="op"
                           v-on:update:content="update_op"
                            :placeholder="'<op>'"
                            :validation="validate_op"
                            :getParentCommands="get_base_commands"
                            @focus="focus"
                            @keyup="onKey"
    ></EditableText
    >&nbsp;<nodecomp :data="data.right" :parent="thisNode" ref="right" :reqPrecedence="precedence+1"></nodecomp
    ><transition name="fade"><span class="parens" v-if="show_parens">)</span
    ></transition></span>
</template>

<script>
  import nodeBase from "./nodeBase";
  import EditableText from "./EditableText";

  export default {
    name: "BinOp",
    mixins: [nodeBase],
    components: {EditableText},
    props: {
      reqPrecedence: Number,
    },
    methods: {
      get_children: function () {
        return [this.$refs.left.get_node(), this.$refs.right.get_node()];
      },
      replace_child: function(child, new_data, delete_from_list=true) {
        let r = (new_data===null)? {type: "expr"}: new_data;
        if (child === this.$refs.left.get_node()){
          this.data.left = r;
          this.$nextTick(function () {
            this.$refs.left.get_node().focus();
          });
        } else if (child === this.$refs.right.get_node()){
          this.data.right = r;
          this.$nextTick(function () {
            this.$refs.right.get_node().focus();
          });
        }
      },
      get_commands: function () {
        return this.get_base_commands().concat([
          ["c", "edit op", this.edit_op, function () {return true;}],
          ["s", "swap operands", this.swap, function () {return true;}],
        ]).concat(this.parent.get_child_commands(this));
      },
      get_child_commands: function(child) {
        return [];
      },
      edit_op: function() {
        this.$refs.op.sel();
      },
      swap: function() {
        let old_left = this.data.left;
        this.data.left = this.data.right;
        this.data.right = old_left;
      },
      validate_op: function (s) {
        return this.ops.indexOf(s) >= 0;
      },
      update_op: function (op) {
        this.data.op.type = this.op_names[this.ops.indexOf(op)];
      }
    },
    computed: {
      ops: function(){
        return ["+", "-", "*", "@", "/", "%", "**", "<<", ">>", "|", "^", "&", "//"];
      },
      op_names: function(){
        return ["Add", "Sub", "Mult", "MatMult", "Div", "Mod", "Pow", "LShift", "RShift", "BitOr", "BitXor", "BitAnd", "FloorDiv"];
      },
      op_prec: function(){
        return  [11, 11, 12, 12, 12, 12, 14, 10, 10, 7, 8, 9, 12];
      },
      op_str: function () {
        switch (this.data.op.type) {
          case "Add":
            return "+";
          case "Sub":
            return "-";
          case "Mult":
            return "*";
          case "MatMult":
            return "@";
          case "Div":
            return "/";
          case "Mod":
            return "%";
          case "Pow":
            return "**";
          case "LShift":
            return "<<";
          case "RShift":
            return ">>";
          case "BitOr":
            return "|";
          case "BitXor":
            return "^";
          case "BitAnd":
            return "&";
          case "FloorDiv":
            return "//";
        }
      },
      precedence: function () {
        let idx = this.op_names.indexOf(this.data.op.type);
        if (idx < 0){
          return -1
        }else{
          return this.op_prec[idx];
        }
      },
      show_parens: function () {
        return this.precedence < this.reqPrecedence;
      }
    }
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: width .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width: 0;
  }

  .fade-leave, .fade-enter-to {
    width: 1ch;
  }

  .parens {
    overflow:hidden;
    vertical-align:top;
    white-space: nowrap;
    display:inline-block;
  }
</style>
